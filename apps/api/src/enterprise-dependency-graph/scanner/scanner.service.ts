import { Injectable, NotFoundException } from "@nestjs/common";
import { DependencyScannerRecord, DependencyScannerStatus } from "./scanner.types";

const createDependencyId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class DependencyScannerService {
  private readonly records = new Map<string, DependencyScannerRecord>();
  private readonly capabilities = "working dependency, operational dependency, episodic dependency, semantic dependency, long-term dependency".split(", ");

  create(input: Pick<DependencyScannerRecord, "name" | "description"> & Partial<Pick<DependencyScannerRecord, "score" | "dependency">>): DependencyScannerRecord {
    const now = new Date().toISOString();
    const record: DependencyScannerRecord = {
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

  activate(id: string): DependencyScannerRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DependencyScannerRecord {
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

  list(): DependencyScannerRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): DependencyScannerRecord { return structuredClone(this.require(id)); }

  status(): DependencyScannerStatus {
    return { system: "AVOS Enterprise Dependency Graph", layer: "Dependency Scanner", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): DependencyScannerRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Dependency Scanner record ${id} was not found`);
    return record;
  }
}