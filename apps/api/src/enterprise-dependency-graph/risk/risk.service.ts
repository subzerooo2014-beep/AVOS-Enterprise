import { Injectable, NotFoundException } from "@nestjs/common";
import { DependencyRiskRecord, DependencyRiskStatus } from "./risk.types";

const createDependencyId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class DependencyRiskService {
  private readonly records = new Map<string, DependencyRiskRecord>();
  private readonly capabilities = "shared dependency, synchronization, distributed coordination, conflict handling".split(", ");

  create(input: Pick<DependencyRiskRecord, "name" | "description"> & Partial<Pick<DependencyRiskRecord, "score" | "dependency">>): DependencyRiskRecord {
    const now = new Date().toISOString();
    const record: DependencyRiskRecord = {
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

  activate(id: string): DependencyRiskRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DependencyRiskRecord {
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

  list(): DependencyRiskRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): DependencyRiskRecord { return structuredClone(this.require(id)); }

  status(): DependencyRiskStatus {
    return { system: "AVOS Enterprise Dependency Graph", layer: "Dependency Risk Graph", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): DependencyRiskRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Dependency Risk Graph record ${id} was not found`);
    return record;
  }
}