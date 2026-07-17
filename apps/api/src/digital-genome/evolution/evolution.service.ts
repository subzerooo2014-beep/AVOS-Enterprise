import { Injectable, NotFoundException } from "@nestjs/common";
import { DigitalGenomeEvolutionRecord, DigitalGenomeEvolutionStatus } from "./evolution.types";

const createGenomeId = (): string =>
  "genome-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);

@Injectable()
export class DigitalGenomeEvolutionService {
  private readonly records = new Map<string, DigitalGenomeEvolutionRecord>();
  private readonly capabilities = "genome evolution, mutation history, compatibility history, roadmap alignment".split(", ");

  create(
    input: Pick<DigitalGenomeEvolutionRecord, "name" | "description" | "owner"> &
      Partial<
        Pick<
          DigitalGenomeEvolutionRecord,
          "genomeId" | "version" | "dnaAssets" | "domains" | "relationships" | "policies" | "metrics" | "healthScore"
        >
      >,
  ): DigitalGenomeEvolutionRecord {
    const now = new Date().toISOString();

    const record: DigitalGenomeEvolutionRecord = {
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

  activate(id: string): DigitalGenomeEvolutionRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DigitalGenomeEvolutionRecord {
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

  list(): DigitalGenomeEvolutionRecord[] {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  get(id: string): DigitalGenomeEvolutionRecord {
    return structuredClone(this.require(id));
  }

  status(): DigitalGenomeEvolutionStatus {
    return {
      system: "AVOS Digital Genome",
      layer: "D ig it al Ge no me Ev ol ut io n",
      status: "operational",
      capabilities: [...this.capabilities],
      records: this.records.size,
    };
  }

  private require(id: string): DigitalGenomeEvolutionRecord {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException("D ig it al Ge no me Ev ol ut io n record " + id + " was not found");
    }

    return record;
  }
}