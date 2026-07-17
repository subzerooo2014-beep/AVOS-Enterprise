import { Injectable } from "@nestjs/common";
import { IntelligenceOrchestrationEventBusService } from "../events/intelligence-orchestration-event-bus.service";
import { UnifiedIntelligenceEngineRegistryService } from "../registry/unified-intelligence-engine-registry.service";

@Injectable()
export class UnifiedIntelligenceObservabilityService {
  private readonly startedAt = Date.now();
  private totalRequests = 0;
  private successfulRequests = 0;
  private failedRequests = 0;
  private readonly latencies: number[] = [];

  constructor(
    private readonly registry: UnifiedIntelligenceEngineRegistryService,
    private readonly events: IntelligenceOrchestrationEventBusService,
  ) {}

  recordSuccess(durationMs: number): void {
    this.totalRequests += 1;
    this.successfulRequests += 1;
    this.latencies.push(durationMs);
    this.trim();
  }

  recordFailure(durationMs: number): void {
    this.totalRequests += 1;
    this.failedRequests += 1;
    this.latencies.push(durationMs);
    this.trim();
  }

  snapshot(): Record<string, unknown> {
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const average =
      sorted.length === 0
        ? 0
        : sorted.reduce((sum, item) => sum + item, 0) / sorted.length;
    const p95Index =
      sorted.length === 0
        ? 0
        : Math.min(
            sorted.length - 1,
            Math.ceil(sorted.length * 0.95) - 1,
          );

    return {
      timestamp: new Date().toISOString(),
      uptimeMs: Date.now() - this.startedAt,
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      successRate:
        this.totalRequests === 0
          ? 100
          : Number(
              (
                (this.successfulRequests / this.totalRequests) *
                100
              ).toFixed(2),
            ),
      averageLatencyMs: Number(average.toFixed(2)),
      p95LatencyMs: sorted.length === 0 ? 0 : sorted[p95Index],
      registry: this.registry.health(),
      emittedEvents: this.events.count(),
    };
  }

  private trim(): void {
    if (this.latencies.length > 1000) {
      this.latencies.splice(0, this.latencies.length - 1000);
    }
  }
}