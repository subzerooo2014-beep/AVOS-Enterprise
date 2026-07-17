import { Injectable, NotFoundException } from "@nestjs/common";
import { DependencyImpactRecord, DependencyImpactStatus } from "./impact.types";

const createDependencyId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class DependencyImpactService {
  private readonly records = new Map<string, DependencyImpactRecord>();
  private readonly capabilities = "permissions, audit, privacy, trust controls".split(", ");

  create(input: Pick<DependencyImpactRecord, "name" | "description"> & Partial<Pick<DependencyImpactRecord, "score" | "dependency">>): DependencyImpactRecord {
    const now = new Date().toISOString();
    const record: DependencyImpactRecord = {
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

  activate(id: string): DependencyImpactRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DependencyImpactRecord {
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

  list(): DependencyImpactRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): DependencyImpactRecord { return structuredClone(this.require(id)); }

  status(): DependencyImpactStatus {
    return { system: "AVOS Enterprise Dependency Graph", layer: "Impact Analysis", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): DependencyImpactRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Impact Analysis record ${id} was not found`);
    return record;
  }
}