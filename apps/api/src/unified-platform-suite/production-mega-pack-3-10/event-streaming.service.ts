import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

export interface EnterpriseEvent {
  id: string;
  topic: string;
  version: number;
  broker: "kafka" | "nats" | "rabbitmq" | "memory";
  payload: Record<string, unknown>;
  occurredAt: string;
}

@Injectable()
export class EnterpriseEventStreamingService {
  private readonly events: EnterpriseEvent[] = [];
  private readonly subscribers = new Map<string, number>();

  publish(input: {
    topic: string;
    payload: Record<string, unknown>;
    version?: number;
    broker?: EnterpriseEvent["broker"];
  }): EnterpriseEvent {
    const event: EnterpriseEvent = {
      id: randomUUID(),
      topic: input.topic,
      version: input.version ?? 1,
      broker: input.broker ?? "memory",
      payload: input.payload,
      occurredAt: new Date().toISOString()
    };

    this.events.push(event);
    return { ...event };
  }

  replay(topic: string, fromIndex = 0): EnterpriseEvent[] {
    return this.events
      .filter((event) => event.topic === topic)
      .slice(Math.max(0, fromIndex))
      .map((event) => ({ ...event }));
  }

  subscribe(topic: string): Record<string, unknown> {
    const count = (this.subscribers.get(topic) ?? 0) + 1;
    this.subscribers.set(topic, count);

    return {
      topic,
      subscribers: count,
      subscribedAt: new Date().toISOString()
    };
  }

  status(): Record<string, unknown> {
    return {
      name: "Enterprise Event Streaming",
      status: "operational",
      abstraction: ["kafka", "nats", "rabbitmq", "memory"],
      eventBus: true,
      replay: true,
      eventStoreSize: this.events.length,
      versioning: true,
      topics: [...new Set(this.events.map((event) => event.topic))],
      subscribers: Object.fromEntries(this.subscribers)
    };
  }
}