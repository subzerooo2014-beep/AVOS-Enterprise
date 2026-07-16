import { Injectable } from "@nestjs/common";
import { OntologyAuditRecord } from "../foundation-pack-19.types";

@Injectable()
export class OntologyAuditService {
  private readonly records: OntologyAuditRecord[] = [];

  record(
    input: Omit<OntologyAuditRecord, "id" | "occurredAt">
  ) {
    const record: OntologyAuditRecord = {
      ...input,
      id: `ontology-audit:${Date.now()}:${this.records.length + 1}`,
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
      failures: this.records.filter(
        (record) => record.outcome === "failure"
      ).length,
      warnings: this.records.filter(
        (record) => record.outcome === "warning"
      ).length,
      blocked: this.records.filter(
        (record) => record.outcome === "blocked"
      ).length
    };
  }
}
