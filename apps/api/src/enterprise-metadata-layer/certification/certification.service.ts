import { Injectable, NotFoundException } from "@nestjs/common";
import { MetadataCertificationRecord, MetadataCertificationStatus } from "./certification.types";

const createMetadataId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MetadataCertificationService {
  private readonly records = new Map<string, MetadataCertificationRecord>();
  private readonly capabilities = "health, verification, readiness, certification".split(", ");

  create(input: Pick<MetadataCertificationRecord, "name" | "description"> & Partial<Pick<MetadataCertificationRecord, "score" | "metadata">>): MetadataCertificationRecord {
    const now = new Date().toISOString();
    const record: MetadataCertificationRecord = {
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

  activate(id: string): MetadataCertificationRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MetadataCertificationRecord {
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

  list(): MetadataCertificationRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MetadataCertificationRecord { return structuredClone(this.require(id)); }

  status(): MetadataCertificationStatus {
    return { system: "AVOS Enterprise Metadata Layer", layer: "Metadata Certification", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MetadataCertificationRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Metadata Certification record ${id} was not found`);
    return record;
  }
}