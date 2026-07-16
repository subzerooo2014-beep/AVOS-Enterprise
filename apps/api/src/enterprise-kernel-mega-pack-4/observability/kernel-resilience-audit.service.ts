import { Injectable } from "@nestjs/common";
import { KernelResilienceAuditRecord } from "../enterprise-kernel-mega-pack-4.types";

@Injectable()
export class KernelResilienceAuditService {
  private readonly records: KernelResilienceAuditRecord[] = [];

  record(
    input: Omit<KernelResilienceAuditRecord, "id" | "occurredAt">
  ) {
    const record: KernelResilienceAuditRecord = {
      ...input,
      id: `kernel-resilience-audit:${Date.now()}:${this.records.length + 1}`,
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
