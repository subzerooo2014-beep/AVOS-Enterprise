import { Injectable } from "@nestjs/common";
import { KnowledgeFabricMetricSnapshot } from "../contracts/knowledge-fabric-production.contracts";
import { KnowledgeFabricEventBusAdapter } from "../integrations/knowledge-fabric-event-bus.adapter";
import { UnifiedKnowledgeRegistryService } from "../registry/unified-knowledge-registry.service";
import { KnowledgeFabricRuntimeService } from "../runtime/knowledge-fabric-runtime.service";

@Injectable()
export class KnowledgeFabricMetricsService {
  private readonly bootedAt = Date.now();
  private readonly latencies: number[] = [];

  constructor(
    private readonly runtime: KnowledgeFabricRuntimeService,
    private readonly registry: UnifiedKnowledgeRegistryService,
    private readonly events: KnowledgeFabricEventBusAdapter,
  ) {}

  recordLatency(durationMs: number): void {
    this.latencies.push(Math.max(0, durationMs));
    if (this.latencies.length > 1000) {
      this.latencies.splice(0, this.latencies.length - 1000);
    }
  }

  snapshot(): KnowledgeFabricMetricSnapshot {
    const runtime = this.runtime.snapshot();
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const total = runtime.completedRequests + runtime.failedRequests;
    const averageLatencyMs =
      sorted.length === 0
        ? 0
        : sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
    const p95Index =
      sorted.length === 0 ? 0 : Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1);

    return {
      timestamp: new Date().toISOString(),
      uptimeMs: Date.now() - this.bootedAt,
      activeRequests: runtime.activeRequests,
      completedRequests: runtime.completedRequests,
      failedRequests: runtime.failedRequests,
      successRate:
        total === 0
          ? 100
          : Number(((runtime.completedRequests / total) * 100).toFixed(2)),
      averageLatencyMs: Number(averageLatencyMs.toFixed(2)),
      p95LatencyMs: sorted.length === 0 ? 0 : sorted[p95Index],
      registryEntries: this.registry.count(),
      emittedEvents: this.events.count(),
    };
  }
}