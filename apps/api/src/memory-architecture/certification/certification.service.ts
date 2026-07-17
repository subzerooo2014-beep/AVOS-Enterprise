import { Injectable, NotFoundException } from "@nestjs/common";
import { MemoryCertificationRecord, MemoryCertificationStatus } from "./certification.types";

const createMemoryId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MemoryCertificationService {
  private readonly records = new Map<string, MemoryCertificationRecord>();
  private readonly capabilities = "health, verification, readiness, certification".split(", ");

  create(input: Pick<MemoryCertificationRecord, "name" | "description"> & Partial<Pick<MemoryCertificationRecord, "score" | "metadata">>): MemoryCertificationRecord {
    const now = new Date().toISOString();
    const record: MemoryCertificationRecord = {
      id: createMemoryId(),
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

  activate(id: string): MemoryCertificationRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MemoryCertificationRecord {
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

  list(): MemoryCertificationRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MemoryCertificationRecord { return structuredClone(this.require(id)); }

  status(): MemoryCertificationStatus {
    return { system: "AVOS Memory Architecture", layer: "Memory Certification", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MemoryCertificationRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Memory Certification record ${id} was not found`);
    return record;
  }
}