import { Injectable, NotFoundException } from "@nestjs/common";
import type { TraceSpanRecord } from "./reliability-observability.types";

@Injectable()
export class DistributedTracingService {
  private readonly spans = new Map<string, TraceSpanRecord>();

  start(
    service: string,
    operation: string,
    traceId?: string,
    parentSpanId?: string,
    metadata: Record<string, unknown> = {},
  ): TraceSpanRecord {
    const span: TraceSpanRecord = {
      id: `span-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      traceId:
        traceId ??
        `trace-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      parentSpanId,
      service,
      operation,
      startedAt: new Date().toISOString(),
      status: "STARTED",
      metadata: { ...metadata },
    };

    this.spans.set(span.id, span);
    return this.clone(span);
  }

  complete(id: string, failed = false): TraceSpanRecord {
    const span = this.spans.get(id);

    if (!span) {
      throw new NotFoundException(`Trace span '${id}' was not found.`);
    }

    const completedAt = new Date();
    span.completedAt = completedAt.toISOString();
    span.durationMs =
      completedAt.getTime() - new Date(span.startedAt).getTime();
    span.status = failed ? "FAILED" : "COMPLETED";

    return this.clone(span);
  }

  trace(traceId: string): TraceSpanRecord[] {
    return Array.from(this.spans.values())
      .filter((span) => span.traceId === traceId)
      .map((span) => this.clone(span));
  }

  list(): TraceSpanRecord[] {
    return Array.from(this.spans.values()).map((span) => this.clone(span));
  }

  count(): number {
    return this.spans.size;
  }

  private clone(span: TraceSpanRecord): TraceSpanRecord {
    return {
      ...span,
      metadata: { ...span.metadata },
    };
  }
}
