import { Injectable, NotFoundException } from "@nestjs/common";
import { MemoryEvolutionRecord, MemoryEvolutionStatus } from "./evolution.types";

const createMemoryId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MemoryEvolutionService {
  private readonly records = new Map<string, MemoryEvolutionRecord>();
  private readonly capabilities = "consolidation, compression, versioning, lineage".split(", ");

  create(input: Pick<MemoryEvolutionRecord, "name" | "description"> & Partial<Pick<MemoryEvolutionRecord, "score" | "metadata">>): MemoryEvolutionRecord {
    const now = new Date().toISOString();
    const record: MemoryEvolutionRecord = {
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

  activate(id: string): MemoryEvolutionRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MemoryEvolutionRecord {
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

  list(): MemoryEvolutionRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MemoryEvolutionRecord { return structuredClone(this.require(id)); }

  status(): MemoryEvolutionStatus {
    return { system: "AVOS Memory Architecture", layer: "Memory Evolution", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MemoryEvolutionRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Memory Evolution record ${id} was not found`);
    return record;
  }
}