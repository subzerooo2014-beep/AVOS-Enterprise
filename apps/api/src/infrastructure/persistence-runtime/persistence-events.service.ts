import { Injectable } from "@nestjs/common";
import type { PersistenceEvent } from "./persistence-runtime.types";

@Injectable()
export class PersistenceEventsService {
  private readonly events: PersistenceEvent[] = [];

  emit(
    type: string,
    aggregate: string,
    payload: Record<string, unknown>,
    aggregateId?: string,
  ): PersistenceEvent {
    const event: PersistenceEvent = {
      id: `pe-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      type,
      aggregate,
      aggregateId,
      payload,
      occurredAt: new Date().toISOString(),
    };

    this.events.unshift(event);

    if (this.events.length > 500) {
      this.events.length = 500;
    }

    return { ...event, payload: { ...event.payload } };
  }

  list(limit = 100): PersistenceEvent[] {
    return this.events.slice(0, Math.max(1, Math.min(limit, 500))).map((event) => ({
      ...event,
      payload: { ...event.payload },
    }));
  }

  count(): number {
    return this.events.length;
  }
}
