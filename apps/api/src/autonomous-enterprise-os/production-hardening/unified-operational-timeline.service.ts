import { Injectable } from "@nestjs/common";

@Injectable()
export class UnifiedOperationalTimelineService {
  private readonly entries: Array<Record<string, unknown>> = [];

  record(type: string, payload: Record<string, unknown>) {
    const entry = {
      id: `aeos-timeline:${Date.now()}:${this.entries.length + 1}`,
      type,
      payload,
      recordedAt: new Date().toISOString(),
    };
    this.entries.push(entry);
    return entry;
  }

  recent(limit = 100) {
    return this.entries.slice(-Math.max(1, Math.min(limit, 500))).reverse();
  }
}