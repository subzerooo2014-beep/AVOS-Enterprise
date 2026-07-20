import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PlatformEvent } from "../contracts/unified-platform.types";

@Injectable()
export class UnifiedEventBusService {
  private readonly history: PlatformEvent[] = [];
  private readonly channels = new Map<string, Set<(event: PlatformEvent) => void>>();

  publish<T>(type: string, source: string, payload: T, correlationId?: string) {
    const event: PlatformEvent<T> = {
      id: randomUUID(),
      type,
      source,
      payload,
      occurredAt: new Date().toISOString(),
      correlationId
    };
    this.history.push(event);
    this.route(event);
    return event;
  }

  subscribe(type: string, handler: (event: PlatformEvent) => void) {
    const handlers = this.channels.get(type) ?? new Set();
    handlers.add(handler);
    this.channels.set(type, handlers);
    return () => handlers.delete(handler);
  }

  replay(eventId: string) {
    const original = this.history.find((event) => event.id === eventId);
    if (!original) return null;
    const replayed = { ...original, id: randomUUID(), replayed: true, occurredAt: new Date().toISOString() };
    this.history.push(replayed);
    this.route(replayed);
    return replayed;
  }

  list(limit = 100) {
    return this.history.slice(-Math.max(1, Math.min(limit, 1000)));
  }

  metrics() {
    return {
      totalEvents: this.history.length,
      eventTypes: new Set(this.history.map((event) => event.type)).size,
      channels: this.channels.size
    };
  }

  private route(event: PlatformEvent) {
    for (const handler of this.channels.get(event.type) ?? []) handler(event);
    for (const handler of this.channels.get("*") ?? []) handler(event);
  }
}