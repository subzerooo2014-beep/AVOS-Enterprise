import { Injectable } from "@nestjs/common";
import { LiveCoordinationAuditRecord } from "../enterprise-nervous-system-mega-pack-6.types";

@Injectable()
export class LiveCoordinationAuditService {
  private readonly records: LiveCoordinationAuditRecord[] = [];

  record(
    input: Omit<LiveCoordinationAuditRecord, "id" | "occurredAt">
  ) {
    const record: LiveCoordinationAuditRecord = {
      ...input,
      id: `live-coordination-audit:${Date.now()}:${this.records.length + 1}`,
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
