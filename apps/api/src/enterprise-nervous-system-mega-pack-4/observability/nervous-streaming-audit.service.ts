import { Injectable } from "@nestjs/common";
import { NervousStreamingAuditRecord } from "../enterprise-nervous-system-mega-pack-4.types";

@Injectable()
export class NervousStreamingAuditService {
  private readonly records: NervousStreamingAuditRecord[] = [];

  record(
    input: Omit<NervousStreamingAuditRecord, "id" | "occurredAt">
  ) {
    const record: NervousStreamingAuditRecord = {
      ...input,
      id: `nervous-streaming-audit:${Date.now()}:${this.records.length + 1}`,
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
