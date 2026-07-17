import { Injectable, NotFoundException } from "@nestjs/common";
const createKnowledgeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
import { KnowledgeSecurityRecord, KnowledgeSecurityStatus } from "./security.types";

@Injectable()
export class KnowledgeSecurityService {
  private readonly records = new Map<string, KnowledgeSecurityRecord>();
  private readonly capabilities = ["access enforcement", "encryption policy", "threat detection", "security audit"];

  create(input: Pick<KnowledgeSecurityRecord, "name" | "description"> & Partial<Pick<KnowledgeSecurityRecord, "score" | "metadata">>): KnowledgeSecurityRecord {
    const now = new Date().toISOString();
    const record: KnowledgeSecurityRecord = {
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

  activate(id: string): KnowledgeSecurityRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  suspend(id: string): KnowledgeSecurityRecord {
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

  list(): KnowledgeSecurityRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): KnowledgeSecurityRecord { return structuredClone(this.require(id)); }

  status(): KnowledgeSecurityStatus {
    return { system: "AVOS Knowledge Fabric", pack: "KF-14 Knowledge Security", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): KnowledgeSecurityRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`KF-14 Knowledge Security record ${id} was not found`);
    return record;
  }
}