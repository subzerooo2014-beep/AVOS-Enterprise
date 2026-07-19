import { Injectable } from "@nestjs/common";
import { FactoryHealthReport } from "../contracts/factory.contracts";
import { FactoryCapabilitiesService } from "./factory-capabilities.service";
import { FactoryLifecycleService } from "./factory-lifecycle.service";
import { ExecutionHistoryService } from "../runtime/execution-history.service";
import { RuntimeMetricsService } from "../runtime/runtime-metrics.service";

@Injectable()
export class FactoryHealthService {
  private readonly startedAt = Date.now();

  constructor(
    private readonly lifecycle: FactoryLifecycleService,
    private readonly capabilities: FactoryCapabilitiesService,
    private readonly history: ExecutionHistoryService,
    private readonly runtimeMetrics: RuntimeMetricsService,
  ) {}

  report(): FactoryHealthReport {
    const state = this.lifecycle.current();
    const capabilitySummary = this.capabilities.summary();
    const metrics = this.runtimeMetrics.snapshot(this.history.list());

    const unhealthy = state === "failed";
    const degraded = state === "degraded" || capabilitySummary.disabled > 0 || metrics.failedExecutions > 0;

    return {
      status: unhealthy ? "unhealthy" : degraded ? "degraded" : "healthy",
      lifecycleState: state,
      uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
      capabilities: capabilitySummary,
      runtime: {
        activeExecutions: metrics.activeExecutions,
        completedExecutions: metrics.completedExecutions,
        failedExecutions: metrics.failedExecutions,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}
