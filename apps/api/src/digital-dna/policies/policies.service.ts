import { Injectable, NotFoundException } from "@nestjs/common";
import { DigitalDnaPoliciesRecord, DigitalDnaPoliciesStatus } from "./policies.types";

const createDnaId = (): string =>
  "dna-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);

@Injectable()
export class DigitalDnaPoliciesService {
  private readonly records = new Map<string, DigitalDnaPoliciesRecord>();
  private readonly capabilities = "policies, permissions, governance rules, approval requirements".split(", ");

  create(
    input: Pick<DigitalDnaPoliciesRecord, "assetType" | "assetId" | "name" | "purpose" | "owner"> &
      Partial<
        Pick<
          DigitalDnaPoliciesRecord,
          "version" | "attributes" | "relations" | "policies" | "permissions" | "events" | "metrics"
        >
      >,
  ): DigitalDnaPoliciesRecord {
    const now = new Date().toISOString();
    const record: DigitalDnaPoliciesRecord = {
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

  activate(id: string): DigitalDnaPoliciesRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DigitalDnaPoliciesRecord {
    const record = this.require(id);
    record.state = "ARCHIVED";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  updateVersion(id: string, version: string): DigitalDnaPoliciesRecord {
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

  list(): DigitalDnaPoliciesRecord[] {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  get(id: string): DigitalDnaPoliciesRecord {
    return structuredClone(this.require(id));
  }

  status(): DigitalDnaPoliciesStatus {
    return {
      system: "AVOS Digital DNA",
      layer: "D ig it al Dn aP ol ic ie s",
      status: "operational",
      capabilities: [...this.capabilities],
      records: this.records.size,
    };
  }

  private require(id: string): DigitalDnaPoliciesRecord {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException("D ig it al Dn aP ol ic ie s record " + id + " was not found");
    }

    return record;
  }
}