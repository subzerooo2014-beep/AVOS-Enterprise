import { Injectable } from "@nestjs/common";
import { TrustAuditEvent } from "../foundation-pack-4.types";

@Injectable()
export class AuditByDesignService {
  private readonly events: TrustAuditEvent[] = [];

  list() {
    return [...this.events];
  }

  record(
    input: Omit<TrustAuditEvent, "id" | "occurredAt">
  ) {
    const event: TrustAuditEvent = {
      ...input,
      id: `trust-audit:${Date.now()}:${this.events.length + 1}`,
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
      critical: this.events.filter((event) => event.severity === "critical")
        .length,
      blocked: this.events.filter((event) => event.result === "blocked").length
    };
  }
}
