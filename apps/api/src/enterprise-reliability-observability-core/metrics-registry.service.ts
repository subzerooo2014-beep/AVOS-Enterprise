import { Injectable } from "@nestjs/common";
import type { MetricRecord } from "./reliability-observability.types";

@Injectable()
export class MetricsRegistryService {
  private readonly metrics: MetricRecord[] = [];

  record(
    name: string,
    value: number,
    unit = "count",
    labels: Record<string, string> = {},
  ): MetricRecord {
    const metric: MetricRecord = {
      id: `metric-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      name,
      value,
      unit,
      labels: { ...labels },
      recordedAt: new Date().toISOString(),
    };

    this.metrics.unshift(metric);

    if (this.metrics.length > 5000) {
      this.metrics.length = 5000;
    }

    return this.clone(metric);
  }

  list(name?: string): MetricRecord[] {
    return this.metrics
      .filter((metric) => (name ? metric.name === name : true))
      .map((metric) => this.clone(metric));
  }

  latest(name: string): MetricRecord | undefined {
    return this.list(name)[0];
  }

  aggregate(name: string) {
    const items = this.list(name);
    const values = items.map((item) => item.value);

    return {
      name,
      count: items.length,
      sum: values.reduce((total, value) => total + value, 0),
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
      average:
        values.length === 0
          ? 0
          : values.reduce((total, value) => total + value, 0) / values.length,
    };
  }

  count(): number {
    return this.metrics.length;
  }

  private clone(metric: MetricRecord): MetricRecord {
    return {
      ...metric,
      labels: { ...metric.labels },
    };
  }
}
