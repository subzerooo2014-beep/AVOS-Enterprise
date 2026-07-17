import { Injectable, NotFoundException } from "@nestjs/common";
import { DigitalGenomeIntelligenceRecord, DigitalGenomeIntelligenceStatus } from "./intelligence.types";

const createGenomeId = (): string =>
  "genome-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);

@Injectable()
export class DigitalGenomeIntelligenceService {
  private readonly records = new Map<string, DigitalGenomeIntelligenceRecord>();
  private readonly capabilities = "AI genome, agent topology, model relationships, intelligence coverage".split(", ");

  create(
    input: Pick<DigitalGenomeIntelligenceRecord, "name" | "description" | "owner"> &
      Partial<
        Pick<
          DigitalGenomeIntelligenceRecord,
          "genomeId" | "version" | "dnaAssets" | "domains" | "relationships" | "policies" | "metrics" | "healthScore"
        >
      >,
  ): DigitalGenomeIntelligenceRecord {
    const now = new Date().toISOString();

    const record: DigitalGenomeIntelligenceRecord = {
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

  activate(id: string): DigitalGenomeIntelligenceRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DigitalGenomeIntelligenceRecord {
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

  list(): DigitalGenomeIntelligenceRecord[] {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  get(id: string): DigitalGenomeIntelligenceRecord {
    return structuredClone(this.require(id));
  }

  status(): DigitalGenomeIntelligenceStatus {
    return {
      system: "AVOS Digital Genome",
      layer: "D ig it al Ge no me In te ll ig en ce",
      status: "operational",
      capabilities: [...this.capabilities],
      records: this.records.size,
    };
  }

  private require(id: string): DigitalGenomeIntelligenceRecord {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException("D ig it al Ge no me In te ll ig en ce record " + id + " was not found");
    }

    return record;
  }
}