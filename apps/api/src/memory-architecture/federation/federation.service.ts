import { Injectable, NotFoundException } from "@nestjs/common";
import { MemoryFederationRecord, MemoryFederationStatus } from "./federation.types";

const createMemoryId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class MemoryFederationService {
  private readonly records = new Map<string, MemoryFederationRecord>();
  private readonly capabilities = "shared memory, synchronization, distributed coordination, conflict handling".split(", ");

  create(input: Pick<MemoryFederationRecord, "name" | "description"> & Partial<Pick<MemoryFederationRecord, "score" | "metadata">>): MemoryFederationRecord {
    const now = new Date().toISOString();
    const record: MemoryFederationRecord = {
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

  activate(id: string): MemoryFederationRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): MemoryFederationRecord {
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

  list(): MemoryFederationRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): MemoryFederationRecord { return structuredClone(this.require(id)); }

  status(): MemoryFederationStatus {
    return { system: "AVOS Memory Architecture", layer: "Memory Federation", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): MemoryFederationRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Memory Federation record ${id} was not found`);
    return record;
  }
}