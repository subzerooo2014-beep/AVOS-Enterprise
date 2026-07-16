import { Injectable } from "@nestjs/common";
import {
  KernelMetricRecord,
  KernelRuntimeTimelineEntry,
  KernelStructuredLog,
  KernelTraceSpan
} from "../enterprise-kernel-mega-pack-7.types";
import { EnterpriseKernelFinalAuditService } from "./enterprise-kernel-final-audit.service";

@Injectable()
export class KernelObservabilityService {
  private readonly logs: KernelStructuredLog[] = [];
  private readonly metrics: KernelMetricRecord[] = [];
  private readonly spans: KernelTraceSpan[] = [];
  private readonly timeline: KernelRuntimeTimelineEntry[] = [];

  constructor(
    private readonly audit: EnterpriseKernelFinalAuditService
  ) {}

  log(input: Omit<KernelStructuredLog, "id" | "occurredAt">) {
    const record: KernelStructuredLog = {
      ...input,
      id: `kernel-log:${Date.now()}:${this.logs.length + 1}`,
      occurredAt: new Date().toISOString()
    };

    this.logs.push(record);

    this.timeline.push({
      id: `kernel-timeline:${Date.now()}:${this.timeline.length + 1}`,
      category: "runtime",
      event: `log:${input.level}`,
      subjectId: input.source,
      status: input.level,
      correlationId: input.correlationId,
      traceId: input.traceId,
      details: {
        message: input.message,
        metadata: input.metadata
      },
      occurredAt: record.occurredAt
    });

    return record;
  }

  metric(input: Omit<KernelMetricRecord, "id" | "recordedAt">) {
    const record: KernelMetricRecord = {
      ...input,
      id: `kernel-metric:${Date.now()}:${this.metrics.length + 1}`,
      recordedAt: new Date().toISOString()
    };

    this.metrics.push(record);
    return record;
  }

  startTrace(input: {
    traceId?: string;
    parentSpanId?: string;
    name: string;
    source: string;
    correlationId: string;
    attributes?: Record<string, unknown>;
  }) {
    const span: KernelTraceSpan = {
      id: `kernel-span:${Date.now()}:${this.spans.length + 1}`,
      traceId: input.traceId ?? `kernel-trace:${Date.now()}`,
      parentSpanId: input.parentSpanId,
      name: input.name,
      source: input.source,
      status: "running",
      correlationId: input.correlationId,
      attributes: input.attributes ?? {},
      startedAt: new Date().toISOString()
    };

    this.spans.push(span);
    return span;
  }

  completeTrace(input: {
    spanId: string;
    status: "completed" | "failed" | "blocked";
    error?: string;
  }) {
    const span = this.spans.find((item) => item.id === input.spanId);

    if (!span) {
      throw new Error(`Kernel trace span not found: ${input.spanId}`);
    }

    span.status = input.status;
    span.error = input.error;
    span.completedAt = new Date().toISOString();

    return span;
  }

  addTimeline(
    input: Omit<KernelRuntimeTimelineEntry, "id" | "occurredAt">
  ) {
    const entry: KernelRuntimeTimelineEntry = {
      ...input,
      id: `kernel-timeline:${Date.now()}:${this.timeline.length + 1}`,
      occurredAt: new Date().toISOString()
    };

    this.timeline.push(entry);
    return entry;
  }

  listLogs() {
    return [...this.logs];
  }

  listMetrics() {
    return [...this.metrics];
  }

  listTraces() {
    return [...this.spans];
  }

  listTimeline() {
    return [...this.timeline];
  }

  summary() {
    return {
      logs: this.logs.length,
      errors: this.logs.filter((x) => x.level === "error" || x.level === "fatal").length,
      metrics: this.metrics.length,
      traces: this.spans.length,
      failedTraces: this.spans.filter((x) => x.status === "failed").length,
      timelineEntries: this.timeline.length
    };
  }
}
