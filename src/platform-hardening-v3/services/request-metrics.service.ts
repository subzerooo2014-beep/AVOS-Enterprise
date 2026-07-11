import { Injectable } from "@nestjs/common";
import { MetricsSnapshot } from "../interfaces/metrics-snapshot.interface";
import { RequestMetric } from "../interfaces/request-metric.interface";

interface PathAggregate {
  requests: number;
  failures: number;
  totalDurationMs: number;
  maximumDurationMs: number;
}

@Injectable()
export class RequestMetricsService {
  private readonly startedAt = new Date();
  private readonly recentMetrics: RequestMetric[] = [];

  private totalRequests = 0;
  private successfulRequests = 0;
  private failedRequests = 0;
  private slowRequests = 0;
  private totalDurationMs = 0;
  private maximumDurationMs = 0;
  private minimumDurationMs = Number.POSITIVE_INFINITY;

  private readonly statusCodes =
    new Map<string, number>();

  private readonly methods =
    new Map<string, number>();

  private readonly paths =
    new Map<string, PathAggregate>();

  record(metric: RequestMetric): void {
    this.totalRequests += 1;
    this.totalDurationMs += metric.durationMs;

    if (metric.success) {
      this.successfulRequests += 1;
    } else {
      this.failedRequests += 1;
    }

    if (metric.slow) {
      this.slowRequests += 1;
    }

    this.maximumDurationMs = Math.max(
      this.maximumDurationMs,
      metric.durationMs,
    );

    this.minimumDurationMs = Math.min(
      this.minimumDurationMs,
      metric.durationMs,
    );

    const statusKey = String(metric.statusCode);

    this.statusCodes.set(
      statusKey,
      (this.statusCodes.get(statusKey) ?? 0) + 1,
    );

    this.methods.set(
      metric.method,
      (this.methods.get(metric.method) ?? 0) + 1,
    );

    const path = this.normalizePath(metric.path);

    const aggregate =
      this.paths.get(path) ?? {
        requests: 0,
        failures: 0,
        totalDurationMs: 0,
        maximumDurationMs: 0,
      };

    aggregate.requests += 1;
    aggregate.totalDurationMs += metric.durationMs;
    aggregate.maximumDurationMs = Math.max(
      aggregate.maximumDurationMs,
      metric.durationMs,
    );

    if (!metric.success) {
      aggregate.failures += 1;
    }

    this.paths.set(path, aggregate);

    this.recentMetrics.unshift(metric);

    if (this.recentMetrics.length > 1000) {
      this.recentMetrics.length = 1000;
    }
  }

  getSnapshot(): MetricsSnapshot {
    const errorRate =
      this.totalRequests > 0
        ? (this.failedRequests / this.totalRequests) *
          100
        : 0;

    const slowRate =
      this.totalRequests > 0
        ? (this.slowRequests / this.totalRequests) *
          100
        : 0;

    return {
      generatedAt: new Date().toISOString(),
      startedAt: this.startedAt.toISOString(),
      uptimeSeconds: Number(
        (
          (Date.now() - this.startedAt.getTime()) /
          1000
        ).toFixed(3),
      ),
      totals: {
        requests: this.totalRequests,
        successfulRequests:
          this.successfulRequests,
        failedRequests: this.failedRequests,
        slowRequests: this.slowRequests,
      },
      rates: {
        errorRatePercent: Number(
          errorRate.toFixed(2),
        ),
        slowRequestRatePercent: Number(
          slowRate.toFixed(2),
        ),
      },
      latency: {
        averageMs:
          this.totalRequests > 0
            ? Number(
                (
                  this.totalDurationMs /
                  this.totalRequests
                ).toFixed(3),
              )
            : 0,
        maximumMs: Number(
          this.maximumDurationMs.toFixed(3),
        ),
        minimumMs:
          this.minimumDurationMs ===
          Number.POSITIVE_INFINITY
            ? 0
            : Number(
                this.minimumDurationMs.toFixed(3),
              ),
      },
      statusCodes: Object.fromEntries(
        this.statusCodes,
      ),
      methods: Object.fromEntries(this.methods),
      paths: Array.from(this.paths.entries())
        .map(([path, item]) => ({
          path,
          requests: item.requests,
          failures: item.failures,
          averageDurationMs: Number(
            (
              item.totalDurationMs / item.requests
            ).toFixed(3),
          ),
          maximumDurationMs: Number(
            item.maximumDurationMs.toFixed(3),
          ),
        }))
        .sort(
          (left, right) =>
            right.requests - left.requests,
        )
        .slice(0, 100),
    };
  }

  getRecent(limit = 100): RequestMetric[] {
    const normalizedLimit = Math.min(
      Math.max(limit, 1),
      1000,
    );

    return this.recentMetrics
      .slice(0, normalizedLimit)
      .map((item) => ({ ...item }));
  }

  private normalizePath(path: string): string {
    return path
      .split("?")[0]
      .replace(
        /\/[0-9a-f]{8}-[0-9a-f-]{27,}/gi,
        "/{id}",
      )
      .replace(/\/\d+/g, "/{id}");
  }
}
