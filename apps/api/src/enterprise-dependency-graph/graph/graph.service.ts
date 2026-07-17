import { Injectable, NotFoundException } from "@nestjs/common";
import { DependencyGraphRecord, DependencyGraphStatus } from "./graph.types";

const createDependencyId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class DependencyGraphService {
  private readonly records = new Map<string, DependencyGraphRecord>();
  private readonly capabilities = "indexing, retrieval, relevance ranking, context building".split(", ");

  create(input: Pick<DependencyGraphRecord, "name" | "description"> & Partial<Pick<DependencyGraphRecord, "score" | "dependency">>): DependencyGraphRecord {
    const now = new Date().toISOString();
    const record: DependencyGraphRecord = {
      id: createDependencyId(),
      name: input.name,
      description: input.description,
      score: Math.max(0, Math.min(100, input.score ?? 100)),
      state: "DRAFT",
      dependency: input.dependency ?? {},
      createdAt: now,
      updatedAt: now,
    };
    this.records.set(record.id, record);
    return structuredClone(record);
  }

  activate(id: string): DependencyGraphRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DependencyGraphRecord {
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

  list(): DependencyGraphRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): DependencyGraphRecord { return structuredClone(this.require(id)); }

  status(): DependencyGraphStatus {
    return { system: "AVOS Enterprise Dependency Graph", layer: "Graph Builder", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): DependencyGraphRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Graph Builder record ${id} was not found`);
    return record;
  }
}