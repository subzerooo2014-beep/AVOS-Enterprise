import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AgpDomainEvent } from "../contracts/agp-runtime.contracts";
import { AgpRuntimeService } from "../runtime/agp-runtime.service";

@Injectable()
export class AgpEventBusService {
  private readonly events: AgpDomainEvent[] = [];
  private readonly handlers = new Map<
    string,
    Array<(event: AgpDomainEvent) => void>
  >();

  constructor(private readonly runtime: AgpRuntimeService) {}

  publish<T>(
    type: string,
    payload: T,
    options?: {
      source?: string;
      aggregateId?: string;
      version?: number;
      metadata?: Record<string, string>;
    },
  ): AgpDomainEvent<T> {
    const event: AgpDomainEvent<T> = {
      id: `agp-event:${randomUUID()}`,
      type,
      version: options?.version ?? 1,
      source: options?.source ?? "agp",
      aggregateId: options?.aggregateId,
      payload,
      metadata: options?.metadata ?? {},
      occurredAt: new Date().toISOString(),
    };

    this.events.push(event as AgpDomainEvent);
    this.runtime.increment("events");

    for (const handler of this.handlers.get(type) ?? []) {
      handler(event as AgpDomainEvent);
    }

    return event;
  }

  subscribe(type: string, handler: (event: AgpDomainEvent) => void): void {
    const handlers = this.handlers.get(type) ?? [];
    handlers.push(handler);
    this.handlers.set(type, handlers);
  }

  replay(type?: string): AgpDomainEvent[] {
    return this.events
      .filter((event) => !type || event.type === type)
      .map((event) => ({ ...event }));
  }

  health() {
    return {
      status: "operational",
      storedEvents: this.events.length,
      subscriptions: [...this.handlers.values()].reduce(
        (sum, handlers) => sum + handlers.length,
        0,
      ),
      generatedAt: new Date().toISOString(),
    };
  }
}