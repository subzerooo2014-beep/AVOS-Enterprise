import { Injectable } from "@nestjs/common";
import { BrainTrustAuditRecord } from "../enterprise-brain-mega-pack-6.types";

@Injectable()
export class BrainTrustAuditService {
  private readonly records: BrainTrustAuditRecord[] = [];

  record(input: Omit<BrainTrustAuditRecord, "id" | "occurredAt">) {
    const record: BrainTrustAuditRecord = {
      ...input,
      id: `brain-trust-audit:${Date.now()}:${this.records.length + 1}`,
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
