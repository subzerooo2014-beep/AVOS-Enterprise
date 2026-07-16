import { Injectable } from "@nestjs/common";
import type { FoundationMetricV1 } from "./foundation-data-reliability-observability-v1.types";

@Injectable()
export class FoundationMetricsV1Service {
  private readonly metrics: FoundationMetricV1[] = [];

  record(
    name: string,
    value: number,
    labels: Record<string, string> = {},
  ): FoundationMetricV1 {
    const metric: FoundationMetricV1 = {
      name,
      value,
      labels: { ...labels },
      recordedAt: new Date().toISOString(),
    };

    this.metrics.unshift(metric);
    return this.clone(metric);
  }

  list(): FoundationMetricV1[] {
    return this.metrics.map((item) => this.clone(item));
  }

  count(): number {
    return this.metrics.length;
  }

  private clone(item: FoundationMetricV1): FoundationMetricV1 {
    return { ...item, labels: { ...item.labels } };
  }
}
