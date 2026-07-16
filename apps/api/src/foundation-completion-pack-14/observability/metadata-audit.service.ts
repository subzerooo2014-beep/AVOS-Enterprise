import { Injectable } from "@nestjs/common";
import { MetadataAuditRecord } from "../foundation-pack-14.types";

@Injectable()
export class MetadataAuditService {
  private readonly records: MetadataAuditRecord[] = [];

  record(
    input: Omit<MetadataAuditRecord, "id" | "occurredAt">
  ) {
    const record: MetadataAuditRecord = {
      ...input,
      id: `metadata-audit:${Date.now()}:${this.records.length + 1}`,
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
