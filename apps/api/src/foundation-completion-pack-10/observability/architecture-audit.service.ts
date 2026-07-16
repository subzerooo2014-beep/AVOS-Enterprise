import { Injectable } from "@nestjs/common";
import { ArchitectureAuditRecord } from "../foundation-pack-10.types";

@Injectable()
export class ArchitectureAuditService {
  private readonly records: ArchitectureAuditRecord[] = [];

  record(
    input: Omit<ArchitectureAuditRecord, "id" | "occurredAt">
  ) {
    const record: ArchitectureAuditRecord = {
      ...input,
      id: `architecture-audit:${Date.now()}:${this.records.length + 1}`,
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
