import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { LaunchMetric } from "./launch-readiness.types";

@Injectable()
export class LaunchMetricsService {
  private readonly metrics = new Map<string, LaunchMetric>();

  record(input: Omit<LaunchMetric, "id" | "recordedAt">): LaunchMetric {
    const metric: LaunchMetric = { ...input, id: randomUUID(), recordedAt: new Date().toISOString() };
    this.metrics.set(metric.id, metric);
    return { ...metric };
  }

  latest(tenantId: string): LaunchMetric[] {
    const byKey = new Map<string, LaunchMetric>();

    for (const metric of Array.from(this.metrics.values()).filter((item) => item.tenantId === tenantId)) {
      const current = byKey.get(metric.key);
      if (!current || new Date(metric.recordedAt).getTime() > new Date(current.recordedAt).getTime()) {
        byKey.set(metric.key, metric);
      }
    }

    return Array.from(byKey.values()).map((item) => ({ ...item }));
  }

  dashboard() {
    return {
      metrics: this.metrics.size,
      tenants: new Set(Array.from(this.metrics.values()).map((item) => item.tenantId)).size,
      generatedAt: new Date().toISOString(),
    };
  }
}