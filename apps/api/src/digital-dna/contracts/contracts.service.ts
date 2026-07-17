import { Injectable, NotFoundException } from "@nestjs/common";
import { DigitalDnaContractsRecord, DigitalDnaContractsStatus } from "./contracts.types";

const createDnaId = (): string =>
  "dna-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);

@Injectable()
export class DigitalDnaContractsService {
  private readonly records = new Map<string, DigitalDnaContractsRecord>();
  private readonly capabilities = "API contracts, event contracts, workflow contracts, compatibility".split(", ");

  create(
    input: Pick<DigitalDnaContractsRecord, "assetType" | "assetId" | "name" | "purpose" | "owner"> &
      Partial<
        Pick<
          DigitalDnaContractsRecord,
          "version" | "attributes" | "relations" | "policies" | "permissions" | "events" | "metrics"
        >
      >,
  ): DigitalDnaContractsRecord {
    const now = new Date().toISOString();
    const record: DigitalDnaContractsRecord = {
      id: createDnaId(),
      assetType: input.assetType,
      assetId: input.assetId,
      name: input.name,
      purpose: input.purpose,
      owner: input.owner,
      state: "DRAFT",
      version: input.version ?? "1.0.0",
      attributes: input.attributes ?? {},
      relations: input.relations ?? [],
      policies: input.policies ?? [],
      permissions: input.permissions ?? [],
      events: input.events ?? [],
      metrics: input.metrics ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);
    return structuredClone(record);
  }

  activate(id: string): DigitalDnaContractsRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DigitalDnaContractsRecord {
    const record = this.require(id);
    record.state = "ARCHIVED";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  updateVersion(id: string, version: string): DigitalDnaContractsRecord {
    const record = this.require(id);
    record.version = version;
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  validate(id: string): {
    id: string;
    valid: boolean;
    completeness: number;
    missing: string[];
  } {
    const record = this.require(id);
    const checks = {
      assetType: Boolean(record.assetType),
      assetId: Boolean(record.assetId),
      name: Boolean(record.name),
      purpose: Boolean(record.purpose),
      owner: Boolean(record.owner),
      version: Boolean(record.version),
    };

    const missing = Object.entries(checks)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    const completeness = Math.round(
      ((Object.keys(checks).length - missing.length) / Object.keys(checks).length) * 100,
    );

    return {
      id: record.id,
      valid: missing.length === 0,
      completeness,
      missing,
    };
  }

  list(): DigitalDnaContractsRecord[] {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  get(id: string): DigitalDnaContractsRecord {
    return structuredClone(this.require(id));
  }

  status(): DigitalDnaContractsStatus {
    return {
      system: "AVOS Digital DNA",
      layer: "D ig it al Dn aC on tr ac ts",
      status: "operational",
      capabilities: [...this.capabilities],
      records: this.records.size,
    };
  }

  private require(id: string): DigitalDnaContractsRecord {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException("D ig it al Dn aC on tr ac ts record " + id + " was not found");
    }

    return record;
  }
}