import { Injectable, NotFoundException } from "@nestjs/common";
import { DigitalDnaEvolutionRecord, DigitalDnaEvolutionStatus } from "./evolution.types";

const createDnaId = (): string =>
  "dna-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);

@Injectable()
export class DigitalDnaEvolutionService {
  private readonly records = new Map<string, DigitalDnaEvolutionRecord>();
  private readonly capabilities = "evolution history, design decisions, mutation tracking, roadmap alignment".split(", ");

  create(
    input: Pick<DigitalDnaEvolutionRecord, "assetType" | "assetId" | "name" | "purpose" | "owner"> &
      Partial<
        Pick<
          DigitalDnaEvolutionRecord,
          "version" | "attributes" | "relations" | "policies" | "permissions" | "events" | "metrics"
        >
      >,
  ): DigitalDnaEvolutionRecord {
    const now = new Date().toISOString();
    const record: DigitalDnaEvolutionRecord = {
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

  activate(id: string): DigitalDnaEvolutionRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DigitalDnaEvolutionRecord {
    const record = this.require(id);
    record.state = "ARCHIVED";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  updateVersion(id: string, version: string): DigitalDnaEvolutionRecord {
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

  list(): DigitalDnaEvolutionRecord[] {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  get(id: string): DigitalDnaEvolutionRecord {
    return structuredClone(this.require(id));
  }

  status(): DigitalDnaEvolutionStatus {
    return {
      system: "AVOS Digital DNA",
      layer: "D ig it al Dn aE vo lu ti on",
      status: "operational",
      capabilities: [...this.capabilities],
      records: this.records.size,
    };
  }

  private require(id: string): DigitalDnaEvolutionRecord {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException("D ig it al Dn aE vo lu ti on record " + id + " was not found");
    }

    return record;
  }
}