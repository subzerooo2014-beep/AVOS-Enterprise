import { Injectable } from "@nestjs/common";
import { createHash, randomBytes } from "crypto";
import { SecretRecord } from "./platform-production-mega-pack-5.types";
import { PlatformSecurityFileStoreService } from "./platform-security-file-store.service";
import { EncryptionControlService } from "./encryption-control.service";
import { SecurityAuditService } from "./security-audit.service";

@Injectable()
export class SecretsManagementService {
  constructor(
    private readonly store: PlatformSecurityFileStoreService,
    private readonly encryption: EncryptionControlService,
    private readonly audit: SecurityAuditService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.list().length > 0) {
      return;
    }

    this.create(
      {
        name: "platform-runtime-bootstrap",
        scope: "production/platform-runtime",
        value: randomBytes(24).toString("hex"),
      },
      "human:khalifa",
    );
  }

  create(
    input: {
      name: string;
      scope: string;
      value: string;
    },
    approvedBy: string,
  ): SecretRecord {
    if (!approvedBy.startsWith("human:")) {
      throw new Error("Secret creation requires Human Final Authority.");
    }

    const current = this.list().filter((item) => item.name === input.name);
    const encryptedValue = this.encryption.encrypt(input.value);

    const record: SecretRecord = {
      id: this.id("secret"),
      name: input.name,
      scope: input.scope,
      version: current.length + 1,
      encryptedValue,
      checksum: createHash("sha256").update(input.value).digest("hex"),
      active: true,
      createdAt: this.now(),
    };

    this.store.writeJson(`secrets/${record.id}.json`, record);
    this.audit.record({
      category: "secrets",
      action: "create",
      actor: approvedBy,
      subject: record.id,
      outcome: "success",
      metadata: { name: record.name, scope: record.scope },
    });

    return record;
  }

  list(): SecretRecord[] {
    return this.store.listJson<SecretRecord>("secrets");
  }
}