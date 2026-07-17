import { Injectable } from "@nestjs/common";

export interface KnowledgeAuditEntry {
  id: string;
  action: string;
  subjectId: string;
  actor: string;
  details: Record<string, unknown>;
  createdAt: string;
}

@Injectable()
export class KnowledgeAuditService {
  private readonly entries: KnowledgeAuditEntry[] = [];

  record(action: string, subjectId: string, actor: string, details: Record<string, unknown> = {}): KnowledgeAuditEntry {
    const entry: KnowledgeAuditEntry = {
      id: `knowledge-audit:${Date.now()}:${this.entries.length + 1}`,
      action,
      subjectId,
      actor,
      details,
      createdAt: new Date().toISOString(),
    };
    this.entries.push(entry);
    return entry;
  }

  list(): KnowledgeAuditEntry[] {
    return [...this.entries].reverse();
  }

  count(): number {
    return this.entries.length;
  }
}