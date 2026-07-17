import { Injectable, NotFoundException } from "@nestjs/common";
import { MemoryStorageRecord, MemoryStorageStatus } from "./storage.types";

const createMemoryId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MemoryStorageService {
  private readonly records = new Map<string, MemoryStorageRecord>();
  private readonly capabilities = "working memory, operational memory, episodic memory, semantic memory, long-term memory".split(", ");

  create(input: Pick<MemoryStorageRecord, "name" | "description"> & Partial<Pick<MemoryStorageRecord, "score" | "metadata">>): MemoryStorageRecord {
    const now = new Date().toISOString();
    const record: MemoryStorageRecord = {
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

  activate(id: string): MemoryStorageRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MemoryStorageRecord {
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

  list(): MemoryStorageRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MemoryStorageRecord { return structuredClone(this.require(id)); }

  status(): MemoryStorageStatus {
    return { system: "AVOS Memory Architecture", layer: "Memory Storage", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MemoryStorageRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Memory Storage record ${id} was not found`);
    return record;
  }
}