import { Injectable } from "@nestjs/common";

export interface EventObservation {
  id: string;
  eventType: string;
  source: string;
  target?: string;
  status: "OBSERVED" | "ROUTED" | "FAILED";
  occurredAt: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class EventPlatformObservabilityService {
  private readonly observations: EventObservation[] = [];

  record(
    eventType: string,
    source: string,
    status: EventObservation["status"],
    target?: string,
    metadata?: Record<string, unknown>,
  ): EventObservation {
    const observation: EventObservation = {
      id: `eo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      eventType,
      source,
      target,
      status,
      occurredAt: new Date().toISOString(),
      metadata,
    };

    this.observations.unshift(observation);

    if (this.observations.length > 500) {
      this.observations.length = 500;
    }

    return { ...observation };
  }

  list(limit = 100): EventObservation[] {
    return this.observations
      .slice(0, Math.max(1, Math.min(limit, 500)))
      .map((item) => ({
        ...item,
        metadata: item.metadata ? { ...item.metadata } : undefined,
      }));
  }

  analytics() {
    return {
      total: this.observations.length,
      observed: this.observations.filter((item) => item.status === "OBSERVED")
        .length,
      routed: this.observations.filter((item) => item.status === "ROUTED")
        .length,
      failed: this.observations.filter((item) => item.status === "FAILED")
        .length,
      eventTypes: new Set(
        this.observations.map((item) => item.eventType),
      ).size,
      sources: new Set(this.observations.map((item) => item.source)).size,
    };
  }
}

