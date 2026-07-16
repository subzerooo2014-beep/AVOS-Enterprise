import { Injectable } from "@nestjs/common";
import {
  BrainDecisionTrace,
  BrainDecisionTraceEvent
} from "../enterprise-brain-mega-pack-6.types";
import { BrainTrustAuditService } from "../observability/brain-trust-audit.service";

@Injectable()
export class BrainDecisionTraceabilityService {
  private readonly traces = new Map<string, BrainDecisionTrace>();

  constructor(
    private readonly audit: BrainTrustAuditService
  ) {}

  list() {
    return Array.from(this.traces.values());
  }

  get(id: string) {
    const trace = this.traces.get(id);

    if (!trace) {
      throw new Error(`Brain decision trace not found: ${id}`);
    }

    return trace;
  }

  start(input: {
    subjectId: string;
    correlationId: string;
    actorIdentityId: string;
  }) {
    const trace: BrainDecisionTrace = {
      id: `brain-decision-trace:${Date.now()}:${this.traces.size + 1}`,
      subjectId: input.subjectId,
      correlationId: input.correlationId,
      events: [],
      status: "open",
      startedAt: new Date().toISOString()
    };

    this.traces.set(trace.id, trace);

    this.addEvent({
      traceId: trace.id,
      subjectId: trace.subjectId,
      eventType: "created",
      actorIdentityId: input.actorIdentityId,
      metadata: {},
      correlationId: input.correlationId
    });

    return this.get(trace.id);
  }

  addEvent(input: {
    traceId: string;
    subjectId: string;
    eventType: BrainDecisionTraceEvent["eventType"];
    actorIdentityId: string;
    input?: unknown;
    output?: unknown;
    metadata?: Record<string, unknown>;
    correlationId: string;
  }) {
    const current = this.get(input.traceId);

    const event: BrainDecisionTraceEvent = {
      id: `brain-trace-event:${Date.now()}:${current.events.length + 1}`,
      traceId: current.id,
      subjectId: input.subjectId,
      eventType: input.eventType,
      sequence: current.events.length + 1,
      actorIdentityId: input.actorIdentityId,
      input: input.input,
      output: input.output,
      metadata: input.metadata ?? {},
      occurredAt: new Date().toISOString()
    };

    const updated: BrainDecisionTrace = {
      ...current,
      events: [...current.events, event],
      status:
        input.eventType === "completed"
          ? "completed"
          : input.eventType === "failed"
            ? "failed"
            : current.status,
      completedAt:
        input.eventType === "completed" ||
        input.eventType === "failed"
          ? new Date().toISOString()
          : current.completedAt
    };

    this.traces.set(updated.id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "traceability",
      action: `brain-trace-event:${input.eventType}`,
      subjectId: updated.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        input.eventType === "failed"
          ? "failure"
          : "success",
      metadata: {
        sequence: event.sequence,
        eventType: event.eventType
      }
    });

    return event;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      completed: items.filter((x) => x.status === "completed").length,
      failed: items.filter((x) => x.status === "failed").length,
      open: items.filter((x) => x.status === "open").length,
      events: items.reduce((sum, item) => sum + item.events.length, 0)
    };
  }
}
