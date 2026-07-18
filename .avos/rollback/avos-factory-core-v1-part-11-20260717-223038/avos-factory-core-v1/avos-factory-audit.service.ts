import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  FactoryAuditEvent
} from "./avos-factory-operational.contracts";
import {
  AvosFactoryGovernanceService
} from "./avos-factory-governance.service";

@Injectable()
export class AvosFactoryAuditService {
  private readonly events: FactoryAuditEvent[] = [];

  constructor(
    private readonly governance:
      AvosFactoryGovernanceService
  ) {}

  append(
    event: Omit<FactoryAuditEvent, "id" | "timestamp">
  ): FactoryAuditEvent {
    const record: FactoryAuditEvent = Object.freeze({
      ...structuredClone(event),
      id: randomUUID(),
      timestamp: new Date().toISOString()
    });

    this.events.unshift(record);

    const retention =
      this.governance.getPolicy().auditRetention;

    if (this.events.length > retention) {
      this.events.length = retention;
    }

    return structuredClone(record);
  }

  list(limit = 100): FactoryAuditEvent[] {
    return this.events
      .slice(
        0,
        Math.max(
          1,
          Math.min(limit, 1000)
        )
      )
      .map((event) => structuredClone(event));
  }

  count(): number {
    return this.events.length;
  }
}
