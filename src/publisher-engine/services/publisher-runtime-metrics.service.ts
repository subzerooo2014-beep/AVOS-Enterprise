import { Injectable } from "@nestjs/common";

interface PublisherChannelMetrics {
  channel: string;
  attempted: number;
  published: number;
  failed: number;
  retried: number;
  deadLettered: number;
  totalDurationMs: number;
  lastDurationMs: number;
  lastAttemptAt?: Date;
  lastSuccessAt?: Date;
  lastFailureAt?: Date;
}

@Injectable()
export class PublisherRuntimeMetricsService {
  private readonly channels = new Map<
    string,
    PublisherChannelMetrics
  >();

  recordAttempt(channel: string): void {
    const metrics = this.getOrCreate(channel);

    metrics.attempted += 1;
    metrics.lastAttemptAt = new Date();
  }

  recordSuccess(
    channel: string,
    durationMs: number,
  ): void {
    const metrics = this.getOrCreate(channel);

    metrics.published += 1;
    metrics.lastSuccessAt = new Date();
    this.recordDuration(metrics, durationMs);
  }

  recordFailure(
    channel: string,
    durationMs: number,
  ): void {
    const metrics = this.getOrCreate(channel);

    metrics.failed += 1;
    metrics.lastFailureAt = new Date();
    this.recordDuration(metrics, durationMs);
  }

  recordRetry(channel: string): void {
    this.getOrCreate(channel).retried += 1;
  }

  recordDeadLetter(channel: string): void {
    this.getOrCreate(channel).deadLettered += 1;
  }

  summary() {
    const channels = Array.from(this.channels.values())
      .sort((left, right) =>
        left.channel.localeCompare(right.channel),
      )
      .map((metrics) => ({
        ...metrics,
        averageDurationMs:
          metrics.attempted > 0
            ? Math.round(
                metrics.totalDurationMs /
                  metrics.attempted,
              )
            : 0,
      }));

    return {
      channels,
      totals: channels.reduce(
        (totals, metrics) => {
          totals.attempted += metrics.attempted;
          totals.published += metrics.published;
          totals.failed += metrics.failed;
          totals.retried += metrics.retried;
          totals.deadLettered +=
            metrics.deadLettered;
          return totals;
        },
        {
          attempted: 0,
          published: 0,
          failed: 0,
          retried: 0,
          deadLettered: 0,
        },
      ),
      generatedAt: new Date(),
    };
  }

  private getOrCreate(
    channel: string,
  ): PublisherChannelMetrics {
    const normalized = String(channel || "unknown")
      .trim()
      .toLowerCase();

    const existing = this.channels.get(normalized);

    if (existing) {
      return existing;
    }

    const created: PublisherChannelMetrics = {
      channel: normalized,
      attempted: 0,
      published: 0,
      failed: 0,
      retried: 0,
      deadLettered: 0,
      totalDurationMs: 0,
      lastDurationMs: 0,
    };

    this.channels.set(normalized, created);

    return created;
  }

  private recordDuration(
    metrics: PublisherChannelMetrics,
    durationMs: number,
  ): void {
    const normalized = Number.isFinite(durationMs)
      ? Math.max(0, Math.round(durationMs))
      : 0;

    metrics.lastDurationMs = normalized;
    metrics.totalDurationMs += normalized;
  }
}
