import { Injectable } from "@nestjs/common";
import { NervousSystemAuditRecord } from "../enterprise-nervous-system-mega-pack-1.types";

@Injectable()
export class NervousSystemAuditService {
  private readonly records: NervousSystemAuditRecord[] = [];

  record(
    input: Omit<NervousSystemAuditRecord, "id" | "occurredAt">
  ) {
    const record: NervousSystemAuditRecord = {
      ...input,
      id: `nervous-system-audit:${Date.now()}:${this.records.length + 1}`,
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
