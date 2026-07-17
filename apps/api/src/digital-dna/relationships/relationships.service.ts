import { Injectable, NotFoundException } from "@nestjs/common";
import { DigitalDnaRelationshipsRecord, DigitalDnaRelationshipsStatus } from "./relationships.types";

const createDnaId = (): string =>
  "dna-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);

@Injectable()
export class DigitalDnaRelationshipsService {
  private readonly records = new Map<string, DigitalDnaRelationshipsRecord>();
  private readonly capabilities = "dependencies, capability links, product links, knowledge links".split(", ");

  create(
    input: Pick<DigitalDnaRelationshipsRecord, "assetType" | "assetId" | "name" | "purpose" | "owner"> &
      Partial<
        Pick<
          DigitalDnaRelationshipsRecord,
          "version" | "attributes" | "relations" | "policies" | "permissions" | "events" | "metrics"
        >
      >,
  ): DigitalDnaRelationshipsRecord {
    const now = new Date().toISOString();
    const record: DigitalDnaRelationshipsRecord = {
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

  activate(id: string): DigitalDnaRelationshipsRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DigitalDnaRelationshipsRecord {
    const record = this.require(id);
    record.state = "ARCHIVED";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  updateVersion(id: string, version: string): DigitalDnaRelationshipsRecord {
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

  list(): DigitalDnaRelationshipsRecord[] {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  get(id: string): DigitalDnaRelationshipsRecord {
    return structuredClone(this.require(id));
  }

  status(): DigitalDnaRelationshipsStatus {
    return {
      system: "AVOS Digital DNA",
      layer: "D ig it al Dn aR el at io ns hi ps",
      status: "operational",
      capabilities: [...this.capabilities],
      records: this.records.size,
    };
  }

  private require(id: string): DigitalDnaRelationshipsRecord {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException("D ig it al Dn aR el at io ns hi ps record " + id + " was not found");
    }

    return record;
  }
}