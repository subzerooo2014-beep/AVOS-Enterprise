import { Injectable } from "@nestjs/common";
import type { FoundationEventV1 } from "./foundation-control-automation-v1.types";

@Injectable()
export class FoundationEventBusV1Service {
  private readonly events: FoundationEventV1[] = [];

  publish(
    topic: string,
    payload: Record<string, unknown>,
    version = 1,
  ): FoundationEventV1 {
    const event: FoundationEventV1 = {
      id: `foundation-event-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      topic,
      version,
      payload: { ...payload },
      status: "PUBLISHED",
      createdAt: new Date().toISOString(),
    };

    this.events.unshift(event);
    return this.clone(event);
  }

  markDelivered(id: string): FoundationEventV1 | undefined {
    const event = this.events.find((item) => item.id === id);
    if (!event) return undefined;

    event.status = "DELIVERED";
    return this.clone(event);
  }

  markFailed(id: string): FoundationEventV1 | undefined {
    const event = this.events.find((item) => item.id === id);
    if (!event) return undefined;

    event.status = "DEAD_LETTER";
    return this.clone(event);
  }

  replay(topic?: string): FoundationEventV1[] {
    return this.events
      .filter((event) => (topic ? event.topic === topic : true))
      .map((event) => this.clone(event));
  }

  list(): FoundationEventV1[] {
    return this.events.map((event) => this.clone(event));
  }

  count(): number {
    return this.events.length;
  }

  deadLetterCount(): number {
    return this.events.filter((event) => event.status === "DEAD_LETTER").length;
  }

  private clone(event: FoundationEventV1): FoundationEventV1 {
    return { ...event, payload: { ...event.payload } };
  }
}
