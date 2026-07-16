import { Injectable } from "@nestjs/common";
import type { DataEventRecord } from "./enterprise-data-foundation.types";

@Injectable()
export class EventAnalyticsService {
  private readonly events: DataEventRecord[] = [];

  ingest(
    type: string,
    source: string,
    payload: Record<string, unknown>,
    occurredAt = new Date().toISOString(),
  ): DataEventRecord {
    const event: DataEventRecord = {
      id: `data-event-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      type,
      source,
      payload: { ...payload },
      occurredAt,
    };

    this.events.unshift(event);

    if (this.events.length > 10000) {
      this.events.length = 10000;
    }

    return this.clone(event);
  }

  list(type?: string): DataEventRecord[] {
    return this.events
      .filter((event) => (type ? event.type === type : true))
      .map((event) => this.clone(event));
  }

  summary() {
    const counts = new Map<string, number>();

    for (const event of this.events) {
      counts.set(event.type, (counts.get(event.type) ?? 0) + 1);
    }

    return {
      total: this.events.length,
      byType: Object.fromEntries(counts.entries()),
    };
  }

  count(): number {
    return this.events.length;
  }

  private clone(event: DataEventRecord): DataEventRecord {
    return {
      ...event,
      payload: { ...event.payload },
    };
  }
}
