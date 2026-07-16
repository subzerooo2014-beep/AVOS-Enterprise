import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityMemoryEvent } from "./capability-intelligence.types";

@Injectable()
export class CapabilityMemoryService {
  private readonly events: CapabilityMemoryEvent[] = [];

  record(
    capabilityKey: string,
    type: CapabilityMemoryEvent["type"],
    payload: Record<string, unknown> = {},
  ) {
    const event: CapabilityMemoryEvent = {
      id: randomUUID(),
      capabilityKey: capabilityKey.toLowerCase(),
      type,
      occurredAt: new Date().toISOString(),
      payload: structuredClone(payload),
    };

    this.events.push(event);
    return structuredClone(event);
  }

  timeline(capabilityKey: string) {
    return this.events
      .filter(
        (event) => event.capabilityKey === capabilityKey.toLowerCase(),
      )
      .map((event) => structuredClone(event));
  }

  list(limit = 500) {
    return this.events
      .slice(Math.max(0, this.events.length - limit))
      .map((event) => structuredClone(event));
  }

  count() {
    return this.events.length;
  }
}