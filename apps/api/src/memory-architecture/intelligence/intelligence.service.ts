import { Injectable, NotFoundException } from "@nestjs/common";
import { MemoryIntelligenceRecord, MemoryIntelligenceStatus } from "./intelligence.types";

const createMemoryId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MemoryIntelligenceService {
  private readonly records = new Map<string, MemoryIntelligenceRecord>();
  private readonly capabilities = "indexing, retrieval, relevance ranking, context building".split(", ");

  create(input: Pick<MemoryIntelligenceRecord, "name" | "description"> & Partial<Pick<MemoryIntelligenceRecord, "score" | "metadata">>): MemoryIntelligenceRecord {
    const now = new Date().toISOString();
    const record: MemoryIntelligenceRecord = {
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

  activate(id: string): MemoryIntelligenceRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MemoryIntelligenceRecord {
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

  list(): MemoryIntelligenceRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MemoryIntelligenceRecord { return structuredClone(this.require(id)); }

  status(): MemoryIntelligenceStatus {
    return { system: "AVOS Memory Architecture", layer: "Memory Intelligence", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MemoryIntelligenceRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Memory Intelligence record ${id} was not found`);
    return record;
  }
}