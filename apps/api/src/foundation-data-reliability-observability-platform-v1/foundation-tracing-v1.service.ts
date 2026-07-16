import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationTraceSpanV1 } from "./foundation-data-reliability-observability-v1.types";

@Injectable()
export class FoundationTracingV1Service {
  private readonly spans = new Map<string, FoundationTraceSpanV1>();

  start(
    traceId: string,
    name: string,
    parentSpanId?: string,
    attributes: Record<string, unknown> = {},
  ): FoundationTraceSpanV1 {
    const span: FoundationTraceSpanV1 = {
      id: `foundation-span-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      traceId,
      parentSpanId,
      name,
      status: "OK",
      startedAt: new Date().toISOString(),
      attributes: { ...attributes },
    };

    this.spans.set(span.id, span);
    return this.clone(span);
  }

  end(id: string, status: FoundationTraceSpanV1["status"]): FoundationTraceSpanV1 {
    const span = this.spans.get(id);

    if (!span) {
      throw new NotFoundException(`Trace span '${id}' was not found.`);
    }

    span.status = status;
    span.endedAt = new Date().toISOString();

    return this.clone(span);
  }

  list(): FoundationTraceSpanV1[] {
    return Array.from(this.spans.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.spans.size;
  }

  private clone(item: FoundationTraceSpanV1): FoundationTraceSpanV1 {
    return { ...item, attributes: { ...item.attributes } };
  }
}
