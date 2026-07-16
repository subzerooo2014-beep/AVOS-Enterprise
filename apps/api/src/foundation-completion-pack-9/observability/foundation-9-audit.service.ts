import { Injectable } from "@nestjs/common";
import { Foundation9AuditRecord } from "../foundation-pack-9.types";

@Injectable()
export class Foundation9AuditService {
  private readonly records: Foundation9AuditRecord[] = [];

  record(
    input: Omit<Foundation9AuditRecord, "id" | "occurredAt">
  ) {
    const record: Foundation9AuditRecord = {
      ...input,
      id: `foundation9-audit:${Date.now()}:${this.records.length + 1}`,
      occurredAt: new Date().toISOString()
    };

    this.records.push(record);
    return record;
  }

  list() {
    return [...this.records];
  }

  byCorrelation(correlationId: string) {
    return this.records.filter(
      (record) => record.correlationId === correlationId
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
