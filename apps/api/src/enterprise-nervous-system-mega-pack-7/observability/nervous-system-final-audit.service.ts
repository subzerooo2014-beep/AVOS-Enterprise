import { Injectable } from "@nestjs/common";
import { NervousSystemFinalAuditRecord } from "../enterprise-nervous-system-mega-pack-7.types";

@Injectable()
export class NervousSystemFinalAuditService {
  private readonly records: NervousSystemFinalAuditRecord[] = [];

  record(
    input: Omit<NervousSystemFinalAuditRecord, "id" | "occurredAt">
  ) {
    const record: NervousSystemFinalAuditRecord = {
      ...input,
      id: `nervous-system-final-audit:${Date.now()}:${this.records.length + 1}`,
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
