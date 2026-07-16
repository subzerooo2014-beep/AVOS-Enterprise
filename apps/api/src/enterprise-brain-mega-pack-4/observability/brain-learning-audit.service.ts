import { Injectable } from "@nestjs/common";
import { BrainLearningAuditRecord } from "../enterprise-brain-mega-pack-4.types";

@Injectable()
export class BrainLearningAuditService {
  private readonly records: BrainLearningAuditRecord[] = [];

  record(
    input: Omit<BrainLearningAuditRecord, "id" | "occurredAt">
  ) {
    const record: BrainLearningAuditRecord = {
      ...input,
      id: `brain-learning-audit:${Date.now()}:${this.records.length + 1}`,
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
