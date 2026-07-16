import { Injectable } from "@nestjs/common";
import { BrainMultiAgentAuditRecord } from "../enterprise-brain-mega-pack-5.types";

@Injectable()
export class BrainMultiAgentAuditService {
  private readonly records: BrainMultiAgentAuditRecord[] = [];

  record(
    input: Omit<BrainMultiAgentAuditRecord, "id" | "occurredAt">
  ) {
    const record: BrainMultiAgentAuditRecord = {
      ...input,
      id: `brain-multi-agent-audit:${Date.now()}:${this.records.length + 1}`,
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
