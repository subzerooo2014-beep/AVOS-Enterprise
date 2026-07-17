import { Injectable, NotFoundException } from "@nestjs/common";
import { DependencyCertificationRecord, DependencyCertificationStatus } from "./certification.types";

const createDependencyId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class DependencyCertificationService {
  private readonly records = new Map<string, DependencyCertificationRecord>();
  private readonly capabilities = "health, verification, readiness, certification".split(", ");

  create(input: Pick<DependencyCertificationRecord, "name" | "description"> & Partial<Pick<DependencyCertificationRecord, "score" | "dependency">>): DependencyCertificationRecord {
    const now = new Date().toISOString();
    const record: DependencyCertificationRecord = {
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

  activate(id: string): DependencyCertificationRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DependencyCertificationRecord {
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

  list(): DependencyCertificationRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): DependencyCertificationRecord { return structuredClone(this.require(id)); }

  status(): DependencyCertificationStatus {
    return { system: "AVOS Enterprise Dependency Graph", layer: "Dependency Certification", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): DependencyCertificationRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Dependency Certification record ${id} was not found`);
    return record;
  }
}