import { Injectable, NotFoundException } from "@nestjs/common";
import { MemoryAnalyticsRecord, MemoryAnalyticsStatus } from "./analytics.types";

const createMemoryId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MemoryAnalyticsService {
  private readonly records = new Map<string, MemoryAnalyticsRecord>();
  private readonly capabilities = "usage metrics, quality metrics, performance, optimization".split(", ");

  create(input: Pick<MemoryAnalyticsRecord, "name" | "description"> & Partial<Pick<MemoryAnalyticsRecord, "score" | "metadata">>): MemoryAnalyticsRecord {
    const now = new Date().toISOString();
    const record: MemoryAnalyticsRecord = {
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

  activate(id: string): MemoryAnalyticsRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MemoryAnalyticsRecord {
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

  list(): MemoryAnalyticsRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MemoryAnalyticsRecord { return structuredClone(this.require(id)); }

  status(): MemoryAnalyticsStatus {
    return { system: "AVOS Memory Architecture", layer: "Memory Analytics", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MemoryAnalyticsRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Memory Analytics record ${id} was not found`);
    return record;
  }
}