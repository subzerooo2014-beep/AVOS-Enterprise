import { Injectable } from "@nestjs/common";
import { EnterpriseKernelFinalAuditRecord } from "../enterprise-kernel-mega-pack-7.types";

@Injectable()
export class EnterpriseKernelFinalAuditService {
  private readonly records: EnterpriseKernelFinalAuditRecord[] = [];

  record(
    input: Omit<EnterpriseKernelFinalAuditRecord, "id" | "occurredAt">
  ) {
    const record: EnterpriseKernelFinalAuditRecord = {
      ...input,
      id: `enterprise-kernel-final-audit:${Date.now()}:${this.records.length + 1}`,
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
      failures: this.records.filter((x) => x.outcome === "failure").length,
      warnings: this.records.filter((x) => x.outcome === "warning").length,
      blocked: this.records.filter((x) => x.outcome === "blocked").length
    };
  }
}
