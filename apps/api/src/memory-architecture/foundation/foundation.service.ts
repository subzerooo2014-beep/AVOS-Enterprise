import { Injectable, NotFoundException } from "@nestjs/common";
import { MemoryFoundationRecord, MemoryFoundationStatus } from "./foundation.types";

const createMemoryId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MemoryFoundationService {
  private readonly records = new Map<string, MemoryFoundationRecord>();
  private readonly capabilities = "identity, registry, metadata, taxonomy".split(", ");

  create(input: Pick<MemoryFoundationRecord, "name" | "description"> & Partial<Pick<MemoryFoundationRecord, "score" | "metadata">>): MemoryFoundationRecord {
    const now = new Date().toISOString();
    const record: MemoryFoundationRecord = {
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

  activate(id: string): MemoryFoundationRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MemoryFoundationRecord {
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

  list(): MemoryFoundationRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MemoryFoundationRecord { return structuredClone(this.require(id)); }

  status(): MemoryFoundationStatus {
    return { system: "AVOS Memory Architecture", layer: "Memory Foundation", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MemoryFoundationRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Memory Foundation record ${id} was not found`);
    return record;
  }
}