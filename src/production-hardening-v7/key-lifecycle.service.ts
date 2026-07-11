import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  createHash,
  randomUUID,
} from "node:crypto";
import { AssuranceStorageService } from "./assurance-storage.service";
import { CreateKeyRecordDto } from "./dto/create-key-record.dto";
import {
  CryptographicKeyRecord,
  KeyLifecycleStatus,
} from "./types/production-hardening-v7.types";

@Injectable()
export class KeyLifecycleService {
  private readonly collection =
    "cryptographic-key-lifecycle";

  constructor(
    private readonly storage: AssuranceStorageService,
  ) {}

  async register(
    dto: CreateKeyRecordDto,
  ): Promise<CryptographicKeyRecord> {
    const records =
      await this.storage.readCollection<CryptographicKeyRecord>(
        this.collection,
      );

    const currentVersions = records.filter(
      (record) => record.keyAlias === dto.keyAlias,
    );

    const version =
      currentVersions.length === 0
        ? 1
        : Math.max(
            ...currentVersions.map(
              (record) => record.version,
            ),
          ) + 1;

    const now = new Date().toISOString();

    const record: CryptographicKeyRecord = {
      id: randomUUID(),
      keyAlias: dto.keyAlias,
      purpose: dto.purpose,
      algorithm: dto.algorithm,
      provider: dto.provider,
      status: dto.status ?? "planned",
      activatedAt: dto.activatedAt,
      rotationDueAt: dto.rotationDueAt,
      fingerprint:
        dto.fingerprint ??
        this.createMetadataFingerprint(
          dto.keyAlias,
          dto.algorithm,
          version,
        ),
      version,
      metadata: dto.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    records.push(record);

    await this.storage.writeCollection(
      this.collection,
      records,
    );

    return record;
  }

  async list(): Promise<CryptographicKeyRecord[]> {
    const records =
      await this.storage.readCollection<CryptographicKeyRecord>(
        this.collection,
      );

    return records.sort(
      (a, b) =>
        a.keyAlias.localeCompare(b.keyAlias) ||
        b.version - a.version,
    );
  }

  async updateStatus(
    id: string,
    status: KeyLifecycleStatus,
  ): Promise<CryptographicKeyRecord> {
    const record =
      await this.storage.findById<CryptographicKeyRecord>(
        this.collection,
        id,
      );

    if (!record) {
      throw new NotFoundException(
        `Cryptographic key record ${id} was not found`,
      );
    }

    const now = new Date().toISOString();

    const updated: CryptographicKeyRecord = {
      ...record,
      status,
      activatedAt:
        status === "active"
          ? record.activatedAt ?? now
          : record.activatedAt,
      retiredAt:
        status === "retired"
          ? now
          : record.retiredAt,
      revokedAt:
        status === "revoked"
          ? now
          : record.revokedAt,
      updatedAt: now,
    };

    await this.storage.replaceById(
      this.collection,
      id,
      updated,
    );

    return updated;
  }

  async evaluateRotationDue(): Promise<{
    evaluated: number;
    rotationDue: number;
    records: CryptographicKeyRecord[];
  }> {
    const records = await this.list();
    const now = new Date();
    let changed = false;

    const updatedRecords = records.map((record) => {
      if (
        record.status === "active" &&
        record.rotationDueAt &&
        new Date(record.rotationDueAt).getTime() <=
          now.getTime()
      ) {
        changed = true;

        return {
          ...record,
          status: "rotation_due" as const,
          updatedAt: now.toISOString(),
        };
      }

      return record;
    });

    if (changed) {
      await this.storage.writeCollection(
        this.collection,
        updatedRecords,
      );
    }

    return {
      evaluated: updatedRecords.length,
      rotationDue: updatedRecords.filter(
        (record) => record.status === "rotation_due",
      ).length,
      records: updatedRecords.filter(
        (record) => record.status === "rotation_due",
      ),
    };
  }

  async seedDefaults(): Promise<{
    created: number;
    total: number;
  }> {
    const records = await this.list();

    if (
      records.some(
        (record) =>
          record.keyAlias === "avos-signing-primary",
      )
    ) {
      return {
        created: 0,
        total: records.length,
      };
    }

    const activatedAt = new Date();
    const rotationDueAt = new Date(
      activatedAt.getTime() +
        90 * 24 * 60 * 60 * 1000,
    );

    await this.register({
      keyAlias: "avos-signing-primary",
      purpose:
        "Digital signatures for AVOS security and compliance evidence",
      algorithm: "RSA-SHA256",
      provider: "AVOS Managed Cryptography",
      status: "active",
      activatedAt: activatedAt.toISOString(),
      rotationDueAt: rotationDueAt.toISOString(),
      metadata: {
        managed: true,
        exportable: false,
      },
    });

    return {
      created: 1,
      total: records.length + 1,
    };
  }

  private createMetadataFingerprint(
    alias: string,
    algorithm: string,
    version: number,
  ): string {
    return createHash("sha256")
      .update(
        `${alias}:${algorithm}:${version}:${Date.now()}`,
      )
      .digest("hex");
  }
}
