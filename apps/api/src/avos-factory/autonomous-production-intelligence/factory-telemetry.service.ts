import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { FactoryTelemetryEvent } from "./factory-intelligence.contracts";

@Injectable()
export class FactoryTelemetryService {
  private readonly events: FactoryTelemetryEvent[] = [];

  record(
    type: string,
    severity: FactoryTelemetryEvent["severity"],
    payload: Record<string, unknown>,
    workItemId?: string,
  ): FactoryTelemetryEvent {
    const event: FactoryTelemetryEvent = {
      id: randomUUID(),
      type,
      workItemId,
      timestamp: new Date().toISOString(),
      severity,
      payload,
    };
    this.events.push(event);
    return event;
  }

  all(): FactoryTelemetryEvent[] {
    return structuredClone(this.events);
  }

  count(type?: string): number {
    return type
      ? this.events.filter((event) => event.type === type).length
      : this.events.length;
  }
}
