import { Injectable, NotFoundException } from "@nestjs/common";
import { MetadataAnalyticsRecord, MetadataAnalyticsStatus } from "./analytics.types";

const createMetadataId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MetadataAnalyticsService {
  private readonly records = new Map<string, MetadataAnalyticsRecord>();
  private readonly capabilities = "usage metrics, quality metrics, performance, optimization".split(", ");

  create(input: Pick<MetadataAnalyticsRecord, "name" | "description"> & Partial<Pick<MetadataAnalyticsRecord, "score" | "metadata">>): MetadataAnalyticsRecord {
    const now = new Date().toISOString();
    const record: MetadataAnalyticsRecord = {
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

  activate(id: string): MetadataAnalyticsRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MetadataAnalyticsRecord {
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

  list(): MetadataAnalyticsRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MetadataAnalyticsRecord { return structuredClone(this.require(id)); }

  status(): MetadataAnalyticsStatus {
    return { system: "AVOS Enterprise Metadata Layer", layer: "Metadata Analytics", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MetadataAnalyticsRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Metadata Analytics record ${id} was not found`);
    return record;
  }
}