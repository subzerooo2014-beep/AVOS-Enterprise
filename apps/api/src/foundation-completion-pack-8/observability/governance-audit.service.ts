import { Injectable } from "@nestjs/common";
import { GovernanceAuditRecord } from "../foundation-pack-8.types";

@Injectable()
export class GovernanceAuditService {
  private readonly records: GovernanceAuditRecord[] = [];

  record(
    input: Omit<GovernanceAuditRecord, "id" | "occurredAt">
  ) {
    const record: GovernanceAuditRecord = {
      ...input,
      id: `governance-audit:${Date.now()}:${this.records.length + 1}`,
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
      blocked: this.records.filter(
        (record) => record.outcome === "blocked"
      ).length,
      failures: this.records.filter(
        (record) => record.outcome === "failure"
      ).length,
      warnings: this.records.filter(
        (record) => record.outcome === "warning"
      ).length
    };
  }
}
