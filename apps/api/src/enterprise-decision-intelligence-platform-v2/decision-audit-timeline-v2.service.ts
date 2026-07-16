import { Injectable } from "@nestjs/common";
import type { DecisionAuditV2 } from "./enterprise-decision-intelligence-v2.types";

@Injectable()
export class DecisionAuditTimelineV2Service {
  private readonly records: DecisionAuditV2[] = [];

  record(
    decisionId: string,
    action: string,
    actor: string,
    details: Record<string, unknown> = {},
  ): DecisionAuditV2 {
    const record: DecisionAuditV2 = {
      id: `decision-audit-v2-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      decisionId,
      action,
      actor,
      details: { ...details },
      createdAt: new Date().toISOString(),
    };

    this.records.unshift(record);
    return this.clone(record);
  }

  list(decisionId?: string): DecisionAuditV2[] {
    return this.records
      .filter((item) => (decisionId ? item.decisionId === decisionId : true))
      .map((item) => this.clone(item));
  }

  count(): number {
    return this.records.length;
  }

  private clone(item: DecisionAuditV2): DecisionAuditV2 {
    return { ...item, details: { ...item.details } };
  }
}
