import { Injectable, NotFoundException } from "@nestjs/common";
import { DependencyRegistryRecord, DependencyRegistryStatus } from "./registry.types";

const createDependencyId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class DependencyRegistryService {
  private readonly records = new Map<string, DependencyRegistryRecord>();
  private readonly capabilities = "node registry, edge registry, dependency identity, graph metadata".split(", ");

  create(input: Pick<DependencyRegistryRecord, "name" | "description"> & Partial<Pick<DependencyRegistryRecord, "score" | "dependency">>): DependencyRegistryRecord {
    const now = new Date().toISOString();
    const record: DependencyRegistryRecord = {
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

  activate(id: string): DependencyRegistryRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DependencyRegistryRecord {
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

  list(): DependencyRegistryRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): DependencyRegistryRecord { return structuredClone(this.require(id)); }

  status(): DependencyRegistryStatus {
    return { system: "AVOS Enterprise Dependency Graph", layer: "Dependency Registry", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): DependencyRegistryRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Dependency Registry record ${id} was not found`);
    return record;
  }
}