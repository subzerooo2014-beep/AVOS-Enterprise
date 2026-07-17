import { Injectable, NotFoundException } from "@nestjs/common";
const createKnowledgeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
import { KnowledgeComplianceRecord, KnowledgeComplianceStatus } from "./compliance.types";

@Injectable()
export class KnowledgeControlComplianceService {
  private readonly records = new Map<string, KnowledgeComplianceRecord>();
  private readonly capabilities = ["control evaluation", "evidence collection", "retention compliance", "compliance reporting"];

  create(input: Pick<KnowledgeComplianceRecord, "name" | "description"> & Partial<Pick<KnowledgeComplianceRecord, "score" | "metadata">>): KnowledgeComplianceRecord {
    const now = new Date().toISOString();
    const record: KnowledgeComplianceRecord = {
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

  activate(id: string): KnowledgeComplianceRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  suspend(id: string): KnowledgeComplianceRecord {
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

  list(): KnowledgeComplianceRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): KnowledgeComplianceRecord { return structuredClone(this.require(id)); }

  status(): KnowledgeComplianceStatus {
    return { system: "AVOS Knowledge Fabric", pack: "KF-15 Knowledge Compliance", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): KnowledgeComplianceRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`KF-15 Knowledge Compliance record ${id} was not found`);
    return record;
  }
}