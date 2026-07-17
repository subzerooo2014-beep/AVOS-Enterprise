import { Injectable, NotFoundException } from "@nestjs/common";
const createKnowledgeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
import { KnowledgeAutomationRecord, KnowledgeAutomationStatus } from "./automation.types";

@Injectable()
export class KnowledgeAutomationService {
  private readonly records = new Map<string, KnowledgeAutomationRecord>();
  private readonly capabilities = ["automation rules", "trigger execution", "action tracking", "human approval"];

  create(input: Pick<KnowledgeAutomationRecord, "name" | "description"> & Partial<Pick<KnowledgeAutomationRecord, "score" | "metadata">>): KnowledgeAutomationRecord {
    const now = new Date().toISOString();
    const record: KnowledgeAutomationRecord = {
      id: createKnowledgeId(),
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

  activate(id: string): KnowledgeAutomationRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  suspend(id: string): KnowledgeAutomationRecord {
    const record = this.require(id);
    record.state = "SUSPENDED";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  evaluate(id: string): { id: string; score: number; level: "excellent" | "good" | "attention" } {
    const record = this.require(id);
    const level = record.score >= 90 ? "excellent" : record.score >= 70 ? "good" : "attention";
    return { id: record.id, score: record.score, level };
  }

  list(): KnowledgeAutomationRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): KnowledgeAutomationRecord { return structuredClone(this.require(id)); }

  status(): KnowledgeAutomationStatus {
    return { system: "AVOS Knowledge Fabric", pack: "KF-17 Knowledge Automation", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): KnowledgeAutomationRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`KF-17 Knowledge Automation record ${id} was not found`);
    return record;
  }
}