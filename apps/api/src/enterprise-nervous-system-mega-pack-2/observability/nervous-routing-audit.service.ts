import { Injectable } from "@nestjs/common";
import { NervousRoutingAuditRecord } from "../enterprise-nervous-system-mega-pack-2.types";

@Injectable()
export class NervousRoutingAuditService {
  private readonly records: NervousRoutingAuditRecord[] = [];

  record(
    input: Omit<NervousRoutingAuditRecord, "id" | "occurredAt">
  ) {
    const record: NervousRoutingAuditRecord = {
      ...input,
      id: `nervous-routing-audit:${Date.now()}:${this.records.length + 1}`,
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
