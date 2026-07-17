import { Injectable, NotFoundException } from "@nestjs/common";
const createKnowledgeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
import { KnowledgeIntelligencePlatformRecord, KnowledgeIntelligencePlatformStatus } from "./platform.types";

@Injectable()
export class KnowledgeIntelligencePlatformService {
  private readonly records = new Map<string, KnowledgeIntelligencePlatformRecord>();
  private readonly capabilities = ["unified intelligence", "semantic operations", "reasoning coordination", "platform diagnostics"];

  create(input: Pick<KnowledgeIntelligencePlatformRecord, "name" | "description"> & Partial<Pick<KnowledgeIntelligencePlatformRecord, "score" | "metadata">>): KnowledgeIntelligencePlatformRecord {
    const now = new Date().toISOString();
    const record: KnowledgeIntelligencePlatformRecord = {
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

  activate(id: string): KnowledgeIntelligencePlatformRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  suspend(id: string): KnowledgeIntelligencePlatformRecord {
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

  list(): KnowledgeIntelligencePlatformRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): KnowledgeIntelligencePlatformRecord { return structuredClone(this.require(id)); }

  status(): KnowledgeIntelligencePlatformStatus {
    return { system: "AVOS Knowledge Fabric", pack: "KF-19 Knowledge Intelligence Platform", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): KnowledgeIntelligencePlatformRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`KF-19 Knowledge Intelligence Platform record ${id} was not found`);
    return record;
  }
}