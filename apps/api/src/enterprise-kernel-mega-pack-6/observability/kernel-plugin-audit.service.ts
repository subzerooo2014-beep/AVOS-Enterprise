import { Injectable } from "@nestjs/common";
import { KernelPluginAuditRecord } from "../enterprise-kernel-mega-pack-6.types";

@Injectable()
export class KernelPluginAuditService {
  private readonly records: KernelPluginAuditRecord[] = [];

  record(
    input: Omit<KernelPluginAuditRecord, "id" | "occurredAt">
  ) {
    const record: KernelPluginAuditRecord = {
      ...input,
      id: `kernel-plugin-audit:${Date.now()}:${this.records.length + 1}`,
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
