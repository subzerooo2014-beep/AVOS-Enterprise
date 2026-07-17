import { Injectable, NotFoundException } from "@nestjs/common";
import { MetadataCatalogRecord, MetadataCatalogStatus } from "./catalog.types";

const createMetadataId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MetadataCatalogService {
  private readonly records = new Map<string, MetadataCatalogRecord>();
  private readonly capabilities = "working metadata, operational metadata, episodic metadata, semantic metadata, long-term metadata".split(", ");

  create(input: Pick<MetadataCatalogRecord, "name" | "description"> & Partial<Pick<MetadataCatalogRecord, "score" | "metadata">>): MetadataCatalogRecord {
    const now = new Date().toISOString();
    const record: MetadataCatalogRecord = {
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

  activate(id: string): MetadataCatalogRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MetadataCatalogRecord {
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

  list(): MetadataCatalogRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MetadataCatalogRecord { return structuredClone(this.require(id)); }

  status(): MetadataCatalogStatus {
    return { system: "AVOS Enterprise Metadata Layer", layer: "Metadata Catalog", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MetadataCatalogRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Metadata Catalog record ${id} was not found`);
    return record;
  }
}