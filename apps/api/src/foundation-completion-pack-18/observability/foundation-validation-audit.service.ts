import { Injectable } from "@nestjs/common";
import { FoundationValidationAuditRecord } from "../foundation-pack-18.types";

@Injectable()
export class FoundationValidationAuditService {
  private readonly records:
    FoundationValidationAuditRecord[] = [];

  record(
    input: Omit<
      FoundationValidationAuditRecord,
      "id" | "occurredAt"
    >
  ) {
    const record: FoundationValidationAuditRecord = {
      ...input,
      id: `foundation-validation-audit:${Date.now()}:${
        this.records.length + 1
      }`,
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
