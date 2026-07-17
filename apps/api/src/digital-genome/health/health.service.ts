import { Injectable, NotFoundException } from "@nestjs/common";
import { DigitalGenomeHealthRecord, DigitalGenomeHealthStatus } from "./health.types";

const createGenomeId = (): string =>
  "genome-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);

@Injectable()
export class DigitalGenomeHealthService {
  private readonly records = new Map<string, DigitalGenomeHealthRecord>();
  private readonly capabilities = "genome health, completeness, consistency, drift detection, quality scoring".split(", ");

  create(
    input: Pick<DigitalGenomeHealthRecord, "name" | "description" | "owner"> &
      Partial<
        Pick<
          DigitalGenomeHealthRecord,
          "genomeId" | "version" | "dnaAssets" | "domains" | "relationships" | "policies" | "metrics" | "healthScore"
        >
      >,
  ): DigitalGenomeHealthRecord {
    const now = new Date().toISOString();

    const record: DigitalGenomeHealthRecord = {
      id: createGenomeId(),
      genomeId: input.genomeId ?? createGenomeId(),
      name: input.name,
      description: input.description,
      owner: input.owner,
      state: "DRAFT",
      version: input.version ?? "1.0.0",
      dnaAssets: input.dnaAssets ?? [],
      domains: input.domains ?? [],
      relationships: input.relationships ?? [],
      policies: input.policies ?? [],
      metrics: input.metrics ?? {},
      healthScore: Math.max(0, Math.min(100, input.healthScore ?? 100)),
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);
    return structuredClone(record);
  }

  activate(id: string): DigitalGenomeHealthRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DigitalGenomeHealthRecord {
    const record = this.require(id);
    record.state = "ARCHIVED";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  assess(id: string): {
    id: string;
    healthScore: number;
    dnaCoverage: number;
    domainCoverage: number;
    status: "excellent" | "good" | "attention";
  } {
    const record = this.require(id);
    const dnaCoverage = Math.min(100, record.dnaAssets.length * 10);
    const domainCoverage = Math.min(100, record.domains.length * 10);
    const status =
      record.healthScore >= 90 ? "excellent" :
      record.healthScore >= 70 ? "good" :
      "attention";

    return {
      id: record.id,
      healthScore: record.healthScore,
      dnaCoverage,
      domainCoverage,
      status,
    };
  }

  list(): DigitalGenomeHealthRecord[] {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  get(id: string): DigitalGenomeHealthRecord {
    return structuredClone(this.require(id));
  }

  status(): DigitalGenomeHealthStatus {
    return {
      system: "AVOS Digital Genome",
      layer: "D ig it al Ge no me He al th",
      status: "operational",
      capabilities: [...this.capabilities],
      records: this.records.size,
    };
  }

  private require(id: string): DigitalGenomeHealthRecord {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException("D ig it al Ge no me He al th record " + id + " was not found");
    }

    return record;
  }
}