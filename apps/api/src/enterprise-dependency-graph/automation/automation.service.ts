import { Injectable, NotFoundException } from "@nestjs/common";
import { DependencyAutomationRecord, DependencyAutomationStatus } from "./automation.types";

const createDependencyId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class DependencyAutomationService {
  private readonly records = new Map<string, DependencyAutomationRecord>();
  private readonly capabilities = "scheduled scans, remediation plans, alerts, orchestration".split(", ");

  create(input: Pick<DependencyAutomationRecord, "name" | "description"> & Partial<Pick<DependencyAutomationRecord, "score" | "dependency">>): DependencyAutomationRecord {
    const now = new Date().toISOString();
    const record: DependencyAutomationRecord = {
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

  activate(id: string): DependencyAutomationRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): DependencyAutomationRecord {
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

  list(): DependencyAutomationRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): DependencyAutomationRecord { return structuredClone(this.require(id)); }

  status(): DependencyAutomationStatus {
    return { system: "AVOS Enterprise Dependency Graph", layer: "Dependency Automation", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): DependencyAutomationRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`Dependency Automation record ${id} was not found`);
    return record;
  }
}