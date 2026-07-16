import { Injectable } from "@nestjs/common";
import { NervousWorkflowAuditRecord } from "../enterprise-nervous-system-mega-pack-3.types";

@Injectable()
export class NervousWorkflowAuditService {
  private readonly records: NervousWorkflowAuditRecord[] = [];

  record(
    input: Omit<NervousWorkflowAuditRecord, "id" | "occurredAt">
  ) {
    const record: NervousWorkflowAuditRecord = {
      ...input,
      id: `nervous-workflow-audit:${Date.now()}:${this.records.length + 1}`,
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
