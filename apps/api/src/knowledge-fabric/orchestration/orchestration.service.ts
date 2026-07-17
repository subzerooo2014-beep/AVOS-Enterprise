import { Injectable, NotFoundException } from "@nestjs/common";
const createKnowledgeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
import { KnowledgeOrchestrationRecord, KnowledgeOrchestrationStatus } from "./orchestration.types";

@Injectable()
export class KnowledgeOrchestrationService {
  private readonly records = new Map<string, KnowledgeOrchestrationRecord>();
  private readonly capabilities = ["workflow planning", "step coordination", "dependency resolution", "execution recovery"];

  create(input: Pick<KnowledgeOrchestrationRecord, "name" | "description"> & Partial<Pick<KnowledgeOrchestrationRecord, "score" | "metadata">>): KnowledgeOrchestrationRecord {
    const now = new Date().toISOString();
    const record: KnowledgeOrchestrationRecord = {
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

  activate(id: string): KnowledgeOrchestrationRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  suspend(id: string): KnowledgeOrchestrationRecord {
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

  list(): KnowledgeOrchestrationRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): KnowledgeOrchestrationRecord { return structuredClone(this.require(id)); }

  status(): KnowledgeOrchestrationStatus {
    return { system: "AVOS Knowledge Fabric", pack: "KF-18 Knowledge Orchestration", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): KnowledgeOrchestrationRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`KF-18 Knowledge Orchestration record ${id} was not found`);
    return record;
  }
}