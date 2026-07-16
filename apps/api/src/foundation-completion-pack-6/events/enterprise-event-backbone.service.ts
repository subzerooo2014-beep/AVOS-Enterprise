import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  NervousSystemEvent,
  NervousSystemEventPriority
} from "../foundation-pack-6.types";
import { EventContractRegistryService } from "../contracts/event-contract-registry.service";
import { NervousSystemTraceService } from "../observability/nervous-system-trace.service";

@Injectable()
export class EnterpriseEventBackboneService {
  private readonly events = new Map<string, NervousSystemEvent>();

  constructor(
    private readonly contracts: EventContractRegistryService,
    private readonly trace: NervousSystemTraceService
  ) {}

  list() {
    return Array.from(this.events.values()).sort(
      (left, right) => right.publishedAt.localeCompare(left.publishedAt)
    );
  }

  get(id: string) {
    const event = this.events.get(id);

    if (!event) {
      throw new NotFoundException(`Nervous system event not found: ${id}`);
    }

    return event;
  }

  publish(input: {
    eventType: string;
    eventVersion: string;
    sourceCapabilityId: string;
    sourceIdentityId: string;
    subjectId: string;
    correlationId: string;
    causationId?: string;
    priority: NervousSystemEventPriority;
    payload: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    occurredAt?: string;
  }) {
    const validation = this.contracts.validatePayload(
      input.eventType,
      input.eventVersion,
      input.payload
    );

    if (validation.contractFound && !validation.valid) {
      throw new BadRequestException(
        `Event payload is missing required fields: ${
          validation.missingFields.join(", ")
        }`
      );
    }

    const now = new Date().toISOString();
    const event: NervousSystemEvent = {
      ...input,
      id: `nervous-event:${Date.now()}:${this.events.size + 1}`,
      metadata: input.metadata ?? {},
      state: "published",
      occurredAt: input.occurredAt ?? now,
      publishedAt: now
    };

    this.events.set(event.id, event);

    this.trace.record({
      correlationId: event.correlationId,
      category: "event",
      action: "published",
      subjectId: event.id,
      actorIdentityId: event.sourceIdentityId,
      outcome: "success",
      metadata: {
        eventType: event.eventType,
        eventVersion: event.eventVersion,
        contractFound: validation.contractFound
      }
    });

    return event;
  }

  updateState(
    id: string,
    state: NervousSystemEvent["state"],
    actorIdentityId = "identity:enterprise-nervous-system"
  ) {
    const current = this.get(id);
    const updated: NervousSystemEvent = {
      ...current,
      state
    };

    this.events.set(id, updated);

    this.trace.record({
      correlationId: updated.correlationId,
      category: "event",
      action: `state:${state}`,
      subjectId: updated.id,
      actorIdentityId,
      outcome:
        state === "failed" || state === "dead-lettered"
          ? "failure"
          : "success",
      metadata: {
        eventType: updated.eventType
      }
    });

    return updated;
  }

  byCorrelation(correlationId: string) {
    return this.list().filter(
      (event) => event.correlationId === correlationId
    );
  }

  summary() {
    const events = this.list();

    return {
      total: events.length,
      delivered: events.filter((event) => event.state === "delivered")
        .length,
      failed: events.filter((event) => event.state === "failed").length,
      deadLettered: events.filter(
        (event) => event.state === "dead-lettered"
      ).length,
      critical: events.filter((event) => event.priority === "critical")
        .length
    };
  }
}
