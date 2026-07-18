import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryDomainEvent
} from "./avos-factory-synchronization.contracts";

@Injectable()
export class AvosFactoryEventBusService {
  private readonly events:
    AvosFactoryDomainEvent[] = [];

  publish(input: Omit<
    AvosFactoryDomainEvent,
    "id" | "source" | "occurredAt"
  >): AvosFactoryDomainEvent {
    const event: AvosFactoryDomainEvent = {
      ...structuredClone(input),
      id: randomUUID(),
      source: "AVOS Factory Core V1",
      occurredAt:
        new Date().toISOString()
    };

    this.events.unshift(event);

    if (this.events.length > 5000) {
      this.events.length = 5000;
    }

    return structuredClone(event);
  }

  list(limit = 100):
    AvosFactoryDomainEvent[] {
    return this.events
      .slice(
        0,
        Math.max(
          1,
          Math.min(limit, 1000)
        )
      )
      .map((event) =>
        structuredClone(event)
      );
  }

  count(): number {
    return this.events.length;
  }
}
