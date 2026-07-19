import { Injectable } from "@nestjs/common";
import {
  HealthState,
  RuntimeHealthSnapshot,
  RuntimeMetric,
} from "./foundation-ultra-pack-d.types";
import { FoundationUltraPackDFileStoreService } from "./foundation-ultra-pack-d-file-store.service";

@Injectable()
export class RuntimeObservabilityService {
  constructor(
    private readonly store: FoundationUltraPackDFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  recordMetric(
    input: Omit<RuntimeMetric, "id" | "recordedAt">,
  ): RuntimeMetric {
    const metric: RuntimeMetric = {
      ...input,
      id: this.id("runtime-metric"),
      recordedAt: this.now(),
    };

    this.store.writeJson(`runtime-metrics/${metric.id}.json`, metric);
    return metric;
  }

  listMetrics(component?: string): RuntimeMetric[] {
    const metrics = this.store.listJson<RuntimeMetric>("runtime-metrics");

    return component
      ? metrics.filter((metric) => metric.component === component)
      : metrics;
  }

  evaluateHealth(component: string): RuntimeHealthSnapshot {
    const metrics = this.listMetrics(component);

    if (metrics.length === 0) {
      const snapshot: RuntimeHealthSnapshot = {
        id: this.id("health-snapshot"),
        component,
        state: "unknown",
        score: 0,
        reasons: ["No runtime metrics are available."],
        metrics: {},
        recordedAt: this.now(),
      };

      this.store.writeJson(`health-snapshots/${snapshot.id}.json`, snapshot);
      return snapshot;
    }

    const latestByMetric = new Map<string, RuntimeMetric>();

    for (const metric of metrics.sort((a, b) =>
      a.recordedAt.localeCompare(b.recordedAt),
    )) {
      latestByMetric.set(metric.metric, metric);
    }

    const reasons: string[] = [];
    let penalty = 0;

    for (const metric of latestByMetric.values()) {
      if (
        metric.thresholdCritical !== undefined &&
        metric.value >= metric.thresholdCritical
      ) {
        penalty += 40;
        reasons.push(
          `${metric.metric} reached critical threshold: ${metric.value}${metric.unit}`,
        );
      } else if (
        metric.thresholdWarning !== undefined &&
        metric.value >= metric.thresholdWarning
      ) {
        penalty += 15;
        reasons.push(
          `${metric.metric} reached warning threshold: ${metric.value}${metric.unit}`,
        );
      }
    }

    const score = Math.max(0, 100 - penalty);
    const state: HealthState =
      score >= 90
        ? "healthy"
        : score >= 60
          ? "degraded"
          : "critical";

    if (reasons.length === 0) {
      reasons.push("All monitored metrics are within configured thresholds.");
    }

    const snapshot: RuntimeHealthSnapshot = {
      id: this.id("health-snapshot"),
      component,
      state,
      score,
      reasons,
      metrics: Object.fromEntries(
        Array.from(latestByMetric.values()).map((metric) => [
          metric.metric,
          metric.value,
        ]),
      ),
      recordedAt: this.now(),
    };

    this.store.writeJson(`health-snapshots/${snapshot.id}.json`, snapshot);
    return snapshot;
  }

  listHealthSnapshots(): RuntimeHealthSnapshot[] {
    return this.store.listJson<RuntimeHealthSnapshot>("health-snapshots");
  }

  reliabilitySummary(): Record<string, unknown> {
    const snapshots = this.listHealthSnapshots();

    const latest = new Map<string, RuntimeHealthSnapshot>();
    for (const snapshot of snapshots.sort((a, b) =>
      a.recordedAt.localeCompare(b.recordedAt),
    )) {
      latest.set(snapshot.component, snapshot);
    }

    const values = Array.from(latest.values());
    const averageScore =
      values.length === 0
        ? 0
        : Math.round(
            values.reduce((sum, snapshot) => sum + snapshot.score, 0) /
              values.length,
          );

    return {
      monitoredComponents: values.length,
      healthy: values.filter((snapshot) => snapshot.state === "healthy").length,
      degraded: values.filter((snapshot) => snapshot.state === "degraded").length,
      critical: values.filter((snapshot) => snapshot.state === "critical").length,
      unknown: values.filter((snapshot) => snapshot.state === "unknown").length,
      averageHealthScore: averageScore,
      operational:
        values.length > 0 &&
        values.every(
          (snapshot) =>
            snapshot.state === "healthy" || snapshot.state === "degraded",
        ),
    };
  }
}