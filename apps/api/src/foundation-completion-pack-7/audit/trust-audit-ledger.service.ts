import { Injectable } from "@nestjs/common";
import { AuditRecord } from "../foundation-pack-7.types";

@Injectable()
export class TrustAuditLedgerService {
  private readonly records: AuditRecord[] = [];

  record(input: Omit<AuditRecord, "id" | "occurredAt">) {
    const record: AuditRecord = {
      ...input,
      id: `trust-audit:${Date.now()}:${this.records.length + 1}`,
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

  bySubject(subjectId: string) {
    return this.records.filter(
      (record) => record.subjectId === subjectId
    );
  }

  summary() {
    return {
      total: this.records.length,
      success: this.records.filter(
        (record) => record.outcome === "success"
      ).length,
      failure: this.records.filter(
        (record) => record.outcome === "failure"
      ).length,
      blocked: this.records.filter(
        (record) => record.outcome === "blocked"
      ).length,
      warning: this.records.filter(
        (record) => record.outcome === "warning"
      ).length
    };
  }
}
