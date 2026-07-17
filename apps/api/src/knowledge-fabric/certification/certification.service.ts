import { Injectable, NotFoundException } from "@nestjs/common";
const createKnowledgeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
import { KnowledgeFabricCertificationRecord, KnowledgeFabricCertificationStatus } from "./certification.types";

@Injectable()
export class KnowledgeFabricCertificationService {
  private readonly records = new Map<string, KnowledgeFabricCertificationRecord>();
  private readonly capabilities = ["architecture validation", "production readiness", "certification scoring", "final health"];

  create(input: Pick<KnowledgeFabricCertificationRecord, "name" | "description"> & Partial<Pick<KnowledgeFabricCertificationRecord, "score" | "metadata">>): KnowledgeFabricCertificationRecord {
    const now = new Date().toISOString();
    const record: KnowledgeFabricCertificationRecord = {
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

  activate(id: string): KnowledgeFabricCertificationRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  suspend(id: string): KnowledgeFabricCertificationRecord {
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

  list(): KnowledgeFabricCertificationRecord[] { return [...this.records.values()].map((record) => structuredClone(record)); }
  get(id: string): KnowledgeFabricCertificationRecord { return structuredClone(this.require(id)); }

  status(): KnowledgeFabricCertificationStatus {
    return { system: "AVOS Knowledge Fabric", pack: "KF-20 Knowledge Fabric Certification", status: "operational", capabilities: [...this.capabilities], records: this.records.size };
  }

  private require(id: string): KnowledgeFabricCertificationRecord {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException(`KF-20 Knowledge Fabric Certification record ${id} was not found`);
    return record;
  }
}