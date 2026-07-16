import { Injectable } from "@nestjs/common";
import { FoundationFinalAuditRecord } from "../foundation-pack-20.types";

@Injectable()
export class FoundationFinalAuditService {
  private readonly records: FoundationFinalAuditRecord[] = [];

  record(
    input: Omit<FoundationFinalAuditRecord, "id" | "occurredAt">
  ) {
    const record: FoundationFinalAuditRecord = {
      ...input,
      id: `foundation-final-audit:${Date.now()}:${this.records.length + 1}`,
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
