import { Injectable } from "@nestjs/common";
import { TelemetryMetric } from "../enterprise-nervous-system-mega-pack-6.types";
import { LiveCoordinationAuditService } from "../observability/live-coordination-audit.service";

@Injectable()
export class LiveTelemetryService {
  private readonly metrics: TelemetryMetric[] = [];

  constructor(
    private readonly audit: LiveCoordinationAuditService
  ) {}

  capture(
    input: Omit<TelemetryMetric, "id" | "capturedAt">
  ) {
    const metric: TelemetryMetric = {
      ...input,
      id: `telemetry:${Date.now()}:${this.metrics.length + 1}`,
      value: Number.isFinite(input.value) ? input.value : 0,
      capturedAt: new Date().toISOString()
    };

    this.metrics.push(metric);

    this.audit.record({
      correlationId: input.correlationId,
      category: "telemetry",
      action: "live-telemetry-captured",
      subjectId: metric.id,
      actorIdentityId: input.sourceId,
      outcome: "success",
      metadata: {
        category: metric.category,
        name: metric.name,
        value: metric.value,
        unit: metric.unit
      }
    });

    return metric;
  }

  list() {
    return [...this.metrics];
  }

  latestByName(name: string) {
    const items = this.metrics.filter((x) => x.name === name);

    return items.length === 0
      ? undefined
      : items[items.length - 1];
  }

  summary() {
    return {
      total: this.metrics.length,
      sources: new Set(this.metrics.map((x) => x.sourceId)).size,
      categories: new Set(this.metrics.map((x) => x.category)).size
    };
  }
}
