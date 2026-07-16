import { Injectable } from "@nestjs/common";
import { DigitalDnaAuditRecord } from "../foundation-pack-15.types";

@Injectable()
export class DigitalDnaAuditService {
  private readonly records: DigitalDnaAuditRecord[] = [];

  record(
    input: Omit<DigitalDnaAuditRecord, "id" | "occurredAt">
  ) {
    const record: DigitalDnaAuditRecord = {
      ...input,
      id: `digital-dna-audit:${Date.now()}:${this.records.length + 1}`,
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
