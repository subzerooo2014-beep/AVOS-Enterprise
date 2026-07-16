import { Injectable } from "@nestjs/common";
import { GovernanceAuditEvent } from "../foundation-pack-5.types";

@Injectable()
export class GovernanceAuditTrailService {
  private readonly events: GovernanceAuditEvent[] = [];

  list() {
    return [...this.events];
  }

  record(
    input: Omit<GovernanceAuditEvent, "id" | "occurredAt">
  ) {
    const event: GovernanceAuditEvent = {
      ...input,
      id: `governance-audit:${Date.now()}:${this.events.length + 1}`,
      occurredAt: new Date().toISOString()
    };

    this.events.push(event);
    return event;
  }

  byCorrelation(correlationId: string) {
    return this.events.filter(
      (event) => event.correlationId === correlationId
    );
  }

  summary() {
    return {
      total: this.events.length,
      blocked: this.events.filter((event) => event.result === "blocked")
        .length,
      failed: this.events.filter((event) => event.result === "failure")
        .length
    };
  }
}
