import { Injectable } from "@nestjs/common";
import { KnowledgeGraphAuditRecord } from "../foundation-pack-13.types";

@Injectable()
export class KnowledgeGraphAuditService {
  private readonly records: KnowledgeGraphAuditRecord[] = [];

  record(
    input: Omit<KnowledgeGraphAuditRecord, "id" | "occurredAt">
  ) {
    const record: KnowledgeGraphAuditRecord = {
      ...input,
      id: `knowledge-graph-audit:${Date.now()}:${this.records.length + 1}`,
      occurredAt: new Date().toISOString()
    };

    this.records.push(record);
    return record;
  }

  list() {
    return [...this.records];
  }

  byCorrelation(correlationId: string) {
    return this.records
      .filter((record) => record.correlationId === correlationId)
      .sort((left, right) =>
        left.occurredAt.localeCompare(right.occurredAt)
      );
  }

  summary() {
    return {
      total: this.records.length,
      failures: this.records.filter(
        (record) => record.outcome === "failure"
      ).length,
      warnings: this.records.filter(
        (record) => record.outcome === "warning"
      ).length,
      blocked: this.records.filter(
        (record) => record.outcome === "blocked"
      ).length
    };
  }
}
