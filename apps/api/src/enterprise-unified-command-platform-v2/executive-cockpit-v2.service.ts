import { Injectable } from "@nestjs/common";
import type { ExecutiveMetricV2 } from "./unified-command-v2.types";

@Injectable()
export class ExecutiveCockpitV2Service {
  private readonly metrics = new Map<string, ExecutiveMetricV2>();

  update(
    id: string,
    name: string,
    value: number,
    unit: string,
    trend: ExecutiveMetricV2["trend"],
    target?: number,
  ): ExecutiveMetricV2 {
    const metric: ExecutiveMetricV2 = {
      id,
      name,
      value,
      unit,
      target,
      trend,
      updatedAt: new Date().toISOString(),
    };

    this.metrics.set(metric.id, metric);
    return { ...metric };
  }

  list(): ExecutiveMetricV2[] {
    return Array.from(this.metrics.values()).map((metric) => ({
      ...metric,
    }));
  }

  count(): number {
    return this.metrics.size;
  }
}
