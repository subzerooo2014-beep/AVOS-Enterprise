import { Injectable, NotFoundException } from "@nestjs/common";
const createKnowledgeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
import { KnowledgeTrustRecord, KnowledgeTrustStatus } from "./trust.types";

@Injectable()
export class KnowledgeTrustService {
  private readonly records = new Map<string, KnowledgeTrustRecord>();
  private readonly capabilities = ["trust scoring", "provenance validation", "attestation", "decision traceability"];

  create(input: Pick<KnowledgeTrustRecord, "name" | "description"> & Partial<Pick<KnowledgeTrustRecord, "score" | "metadata">>): KnowledgeTrustRecord {
    const now = new Date().toISOString();
    const record: KnowledgeTrustRecord = {
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

  activate(id: string): KnowledgeTrustRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  suspend(id: string): KnowledgeTrustRecord {
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

  list(): KnowledgeTrustRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): KnowledgeTrustRecord { return structuredClone(this.require(id)); }

  status(): KnowledgeTrustStatus {
    return { system: "AVOS Knowledge Fabric", pack: "KF-13 Knowledge Trust", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): KnowledgeTrustRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`KF-13 Knowledge Trust record ${id} was not found`);
    return record;
  }
}