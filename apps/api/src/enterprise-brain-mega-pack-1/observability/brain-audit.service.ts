import { Injectable } from "@nestjs/common";
import { BrainAuditRecord } from "../enterprise-brain-mega-pack-1.types";

@Injectable()
export class BrainAuditService {
  private readonly records: BrainAuditRecord[] = [];

  record(
    input: Omit<BrainAuditRecord, "id" | "occurredAt">
  ) {
    const record: BrainAuditRecord = {
      ...input,
      id: `brain-audit:${Date.now()}:${this.records.length + 1}`,
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
