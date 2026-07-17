import { Injectable, NotFoundException } from "@nestjs/common";
import { MetadataSchemaRecord, MetadataSchemaStatus } from "./schema.types";

const createMetadataId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MetadataSchemaService {
  private readonly records = new Map<string, MetadataSchemaRecord>();
  private readonly capabilities = "indexing, retrieval, relevance ranking, context building".split(", ");

  create(input: Pick<MetadataSchemaRecord, "name" | "description"> & Partial<Pick<MetadataSchemaRecord, "score" | "metadata">>): MetadataSchemaRecord {
    const now = new Date().toISOString();
    const record: MetadataSchemaRecord = {
      id: createMetadataId(),
      name: input.name,
      description: input.description,
      score: Math.max(0, Math.min(100, input.score ?? 100)),
      state: "DRAFT",
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };
    this.records.set(record.id, record);
    return structuredClone(record);
  }

  activate(id: string): MetadataSchemaRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MetadataSchemaRecord {
    const record = this.require(id);
    record.state = "ARCHIVED";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  evaluate(id: string): { id: string; score: number; level: "excellent" | "good" | "attention" } {
    const record = this.require(id);
    const level = record.score >= 90 ? "excellent" : record.score >= 70 ? "good" : "attention";
    return { id: record.id, score: record.score, level };
  }

  list(): MetadataSchemaRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MetadataSchemaRecord { return structuredClone(this.require(id)); }

  status(): MetadataSchemaStatus {
    return { system: "AVOS Enterprise Metadata Layer", layer: "Metadata Schema", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MetadataSchemaRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Metadata Schema record ${id} was not found`);
    return record;
  }
}