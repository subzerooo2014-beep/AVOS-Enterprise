import { Injectable } from "@nestjs/common";
import { EvolutionAuditRecord } from "../foundation-pack-11.types";

@Injectable()
export class EvolutionAuditService {
  private readonly records: EvolutionAuditRecord[] = [];

  record(
    input: Omit<EvolutionAuditRecord, "id" | "occurredAt">
  ) {
    const record: EvolutionAuditRecord = {
      ...input,
      id: `evolution-audit:${Date.now()}:${this.records.length + 1}`,
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
      blocked: this.records.filter(
        (record) => record.outcome === "blocked"
      ).length,
      warnings: this.records.filter(
        (record) => record.outcome === "warning"
      ).length,
      pending: this.records.filter(
        (record) => record.outcome === "pending"
      ).length
    };
  }
}
