import { Injectable } from "@nestjs/common";
import { UrpEndpointDiscoveryService } from "./urp-endpoint-discovery.service";
import { UrpResilienceService } from "./urp-resilience.service";
import { UrpDistributedRegistryService } from "./urp-distributed-registry.service";
import { UrpProductionAuditService } from "./urp-production-audit.service";

@Injectable()
export class UrpProductionObservabilityService {
  private readonly counters = new Map<string, number>();
  private readonly latencies = new Map<string, number[]>();

  constructor(
    private readonly discovery: UrpEndpointDiscoveryService,
    private readonly resilience: UrpResilienceService,
    private readonly registry: UrpDistributedRegistryService,
    private readonly audit: UrpProductionAuditService,
  ) {}

  count(metric: string, amount = 1) {
    this.counters.set(metric, (this.counters.get(metric) ?? 0) + amount);
  }

  latency(metric: string, valueMs: number) {
    const values = this.latencies.get(metric) ?? [];
    values.push(valueMs);
    values.splice(0, Math.max(values.length - 1000, 0));
    this.latencies.set(metric, values);
  }

  async snapshot() {
    const latencyStats = Object.fromEntries(
      [...this.latencies.entries()].map(([key, values]) => [
        key,
        {
          count: values.length,
          averageMs:
            values.length === 0
              ? 0
              : Math.round(
                  values.reduce((sum, value) => sum + value, 0) / values.length,
                ),
          maxMs: values.length === 0 ? 0 : Math.max(...values),
        },
      ]),
    );

    return {
      name: "URP Production Observability",
      version: "URP-1.1.0",
      counters: Object.fromEntries(this.counters.entries()),
      latencies: latencyStats,
      endpoints: this.discovery.cached(),
      circuits: this.resilience.list(),
      distributedRegistry: await this.registry.status(),
      recentAudit: await this.audit.recent(25),
      process: {
        pid: process.pid,
        uptimeSeconds: process.uptime(),
        memory: process.memoryUsage(),
      },
      capturedAt: new Date().toISOString(),
    };
  }
}