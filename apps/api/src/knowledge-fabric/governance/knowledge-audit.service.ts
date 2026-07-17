
import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeAuditEntry } from "./knowledge-governance.types";

@Injectable()
export class KnowledgeAuditService {
  private readonly entries: KnowledgeAuditEntry[] = [];

  record(entry: Omit<KnowledgeAuditEntry, "id" | "timestamp">): KnowledgeAuditEntry {
    const saved: KnowledgeAuditEntry = { ...entry, id: randomUUID(), timestamp: new Date().toISOString() };
    this.entries.push(saved);
    return { ...saved };
  }

  list(knowledgeId?: string, limit = 100): KnowledgeAuditEntry[] {
    return this.entries.filter((entry) => !knowledgeId || entry.knowledgeId === knowledgeId).slice(-Math.max(1, limit)).reverse().map((entry) => ({ ...entry }));
  }
}