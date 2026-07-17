import { Injectable, NotFoundException } from "@nestjs/common";
const createKnowledgeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
import { KnowledgeAnalyticsRecord, KnowledgeAnalyticsStatus } from "./analytics.types";

@Injectable()
export class KnowledgeAnalyticsService {
  private readonly records = new Map<string, KnowledgeAnalyticsRecord>();
  private readonly capabilities = ["usage analytics", "impact analytics", "trend detection", "executive reporting"];

  create(input: Pick<KnowledgeAnalyticsRecord, "name" | "description"> & Partial<Pick<KnowledgeAnalyticsRecord, "score" | "metadata">>): KnowledgeAnalyticsRecord {
    const now = new Date().toISOString();
    const record: KnowledgeAnalyticsRecord = {
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

  activate(id: string): KnowledgeAnalyticsRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  suspend(id: string): KnowledgeAnalyticsRecord {
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

  list(): KnowledgeAnalyticsRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): KnowledgeAnalyticsRecord { return structuredClone(this.require(id)); }

  status(): KnowledgeAnalyticsStatus {
    return { system: "AVOS Knowledge Fabric", pack: "KF-16 Knowledge Analytics", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): KnowledgeAnalyticsRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`KF-16 Knowledge Analytics record ${id} was not found`);
    return record;
  }
}