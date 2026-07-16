import { Injectable } from "@nestjs/common";
import { EnterpriseBrainFinalAuditRecord } from "../enterprise-brain-mega-pack-7.types";

@Injectable()
export class EnterpriseBrainFinalAuditService {
  private readonly records: EnterpriseBrainFinalAuditRecord[] = [];

  record(
    input: Omit<EnterpriseBrainFinalAuditRecord, "id" | "occurredAt">
  ) {
    const record: EnterpriseBrainFinalAuditRecord = {
      ...input,
      id: `enterprise-brain-final-audit:${Date.now()}:${this.records.length + 1}`,
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
