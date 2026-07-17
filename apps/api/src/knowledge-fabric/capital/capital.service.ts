import { Injectable, NotFoundException } from "@nestjs/common";
const createKnowledgeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
import { KnowledgeCapitalRecord, KnowledgeCapitalStatus } from "./capital.types";

@Injectable()
export class KnowledgeCapitalService {
  private readonly records = new Map<string, KnowledgeCapitalRecord>();
  private readonly capabilities = ["asset capitalization", "portfolio valuation", "capital allocation", "capital growth"];

  create(input: Pick<KnowledgeCapitalRecord, "name" | "description"> & Partial<Pick<KnowledgeCapitalRecord, "score" | "metadata">>): KnowledgeCapitalRecord {
    const now = new Date().toISOString();
    const record: KnowledgeCapitalRecord = {
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

  activate(id: string): KnowledgeCapitalRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  suspend(id: string): KnowledgeCapitalRecord {
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

  list(): KnowledgeCapitalRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): KnowledgeCapitalRecord { return structuredClone(this.require(id)); }

  status(): KnowledgeCapitalStatus {
    return { system: "AVOS Knowledge Fabric", pack: "KF-12 Knowledge Capital", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): KnowledgeCapitalRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`KF-12 Knowledge Capital record ${id} was not found`);
    return record;
  }
}