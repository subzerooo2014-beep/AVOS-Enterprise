import { Injectable } from "@nestjs/common";
import { KernelSecurityAuditRecord } from "../enterprise-kernel-mega-pack-3.types";

@Injectable()
export class KernelSecurityAuditService {
  private readonly records: KernelSecurityAuditRecord[] = [];

  record(
    input: Omit<KernelSecurityAuditRecord, "id" | "occurredAt">
  ) {
    const record: KernelSecurityAuditRecord = {
      ...input,
      id: `kernel-security-audit:${Date.now()}:${this.records.length + 1}`,
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
