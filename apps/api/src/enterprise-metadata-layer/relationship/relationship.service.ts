import { Injectable, NotFoundException } from "@nestjs/common";
import { MetadataRelationshipRecord, MetadataRelationshipStatus } from "./relationship.types";

const createMetadataId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MetadataRelationshipService {
  private readonly records = new Map<string, MetadataRelationshipRecord>();
  private readonly capabilities = "shared metadata, synchronization, distributed coordination, conflict handling".split(", ");

  create(input: Pick<MetadataRelationshipRecord, "name" | "description"> & Partial<Pick<MetadataRelationshipRecord, "score" | "metadata">>): MetadataRelationshipRecord {
    const now = new Date().toISOString();
    const record: MetadataRelationshipRecord = {
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

  activate(id: string): MetadataRelationshipRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MetadataRelationshipRecord {
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

  list(): MetadataRelationshipRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MetadataRelationshipRecord { return structuredClone(this.require(id)); }

  status(): MetadataRelationshipStatus {
    return { system: "AVOS Enterprise Metadata Layer", layer: "Metadata Relationship Graph", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MetadataRelationshipRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Metadata Relationship Graph record ${id} was not found`);
    return record;
  }
}