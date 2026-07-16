import { Injectable } from "@nestjs/common";
import { KernelMessagingAuditRecord } from "../enterprise-kernel-mega-pack-5.types";

@Injectable()
export class KernelMessagingAuditService {
  private readonly records: KernelMessagingAuditRecord[] = [];

  record(
    input: Omit<KernelMessagingAuditRecord, "id" | "occurredAt">
  ) {
    const record: KernelMessagingAuditRecord = {
      ...input,
      id: `kernel-messaging-audit:${Date.now()}:${this.records.length + 1}`,
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
