import { Injectable } from "@nestjs/common";
import { BrainKnowledgeAuditRecord } from "../enterprise-brain-mega-pack-2.types";

@Injectable()
export class BrainKnowledgeAuditService {
  private readonly records: BrainKnowledgeAuditRecord[] = [];

  record(
    input: Omit<BrainKnowledgeAuditRecord, "id" | "occurredAt">
  ) {
    const record: BrainKnowledgeAuditRecord = {
      ...input,
      id: `brain-knowledge-audit:${Date.now()}:${this.records.length + 1}`,
      occurredAt: new Date().toISOString()
    };

    this.records.push(record);
    return record;
  }

  list() {
    return [...this.records];
  }

  summary() {
    return {
      total: this.records.length,
      failures: this.records.filter((x) => x.outcome === "failure").length,
      warnings: this.records.filter((x) => x.outcome === "warning").length,
      blocked: this.records.filter((x) => x.outcome === "blocked").length
    };
  }
}
