import { Injectable, NotFoundException } from "@nestjs/common";
import { DigitalGenomeProductsRecord, DigitalGenomeProductsStatus } from "./products.types";

const createGenomeId = (): string =>
  "genome-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);

@Injectable()
export class DigitalGenomeProductsService {
  private readonly records = new Map<string, DigitalGenomeProductsRecord>();
  private readonly capabilities = "product genome, product composition, product lineage, product dependencies".split(", ");

  create(
    input: Pick<DigitalGenomeProductsRecord, "name" | "description" | "owner"> &
      Partial<
        Pick<
          DigitalGenomeProductsRecord,
          "genomeId" | "version" | "dnaAssets" | "domains" | "relationships" | "policies" | "metrics" | "healthScore"
        >
      >,
  ): DigitalGenomeProductsRecord {
    const now = new Date().toISOString();

    const record: DigitalGenomeProductsRecord = {
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

  activate(id: string): DigitalGenomeProductsRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DigitalGenomeProductsRecord {
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

  list(): DigitalGenomeProductsRecord[] {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  get(id: string): DigitalGenomeProductsRecord {
    return structuredClone(this.require(id));
  }

  status(): DigitalGenomeProductsStatus {
    return {
      system: "AVOS Digital Genome",
      layer: "D ig it al Ge no me Pr od uc ts",
      status: "operational",
      capabilities: [...this.capabilities],
      records: this.records.size,
    };
  }

  private require(id: string): DigitalGenomeProductsRecord {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException("D ig it al Ge no me Pr od uc ts record " + id + " was not found");
    }

    return record;
  }
}