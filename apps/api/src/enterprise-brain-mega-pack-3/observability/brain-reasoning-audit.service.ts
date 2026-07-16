import { Injectable } from "@nestjs/common";
import { BrainReasoningAuditRecord } from "../enterprise-brain-mega-pack-3.types";

@Injectable()
export class BrainReasoningAuditService {
  private readonly records: BrainReasoningAuditRecord[] = [];

  record(
    input: Omit<BrainReasoningAuditRecord, "id" | "occurredAt">
  ) {
    const record: BrainReasoningAuditRecord = {
      ...input,
      id: `brain-reasoning-audit:${Date.now()}:${this.records.length + 1}`,
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
