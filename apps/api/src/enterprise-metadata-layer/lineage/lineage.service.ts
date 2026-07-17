import { Injectable, NotFoundException } from "@nestjs/common";
import { MetadataLineageRecord, MetadataLineageStatus } from "./lineage.types";

const createMetadataId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MetadataLineageService {
  private readonly records = new Map<string, MetadataLineageRecord>();
  private readonly capabilities = "consolidation, compression, versioning, lineage".split(", ");

  create(input: Pick<MetadataLineageRecord, "name" | "description"> & Partial<Pick<MetadataLineageRecord, "score" | "metadata">>): MetadataLineageRecord {
    const now = new Date().toISOString();
    const record: MetadataLineageRecord = {
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

  activate(id: string): MetadataLineageRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MetadataLineageRecord {
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

  list(): MetadataLineageRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MetadataLineageRecord { return structuredClone(this.require(id)); }

  status(): MetadataLineageStatus {
    return { system: "AVOS Enterprise Metadata Layer", layer: "Metadata Lineage", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MetadataLineageRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Metadata Lineage record ${id} was not found`);
    return record;
  }
}