import { Injectable } from "@nestjs/common";
import { GenomeAuditRecord } from "../foundation-pack-16.types";

@Injectable()
export class GenomeAuditService {
  private readonly records: GenomeAuditRecord[] = [];

  record(
    input: Omit<GenomeAuditRecord, "id" | "occurredAt">
  ) {
    const record: GenomeAuditRecord = {
      ...input,
      id: `genome-audit:${Date.now()}:${this.records.length + 1}`,
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
