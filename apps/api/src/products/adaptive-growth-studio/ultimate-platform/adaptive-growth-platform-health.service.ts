import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthCapabilityDispatcherService } from "./adaptive-growth-capability-dispatcher.service";
import { AdaptiveGrowthCapabilityRegistryService } from "./adaptive-growth-capability-registry.service";
import { AdaptiveGrowthEnterpriseEventBusService } from "./adaptive-growth-enterprise-event-bus.service";
import { AdaptiveGrowthMetricsService } from "./adaptive-growth-metrics.service";
import { AdaptiveGrowthWorkflowEngineService } from "./adaptive-growth-workflow-engine.service";

@Injectable()
export class AdaptiveGrowthPlatformHealthService {
  constructor(
    private readonly registry: AdaptiveGrowthCapabilityRegistryService,
    private readonly dispatcher: AdaptiveGrowthCapabilityDispatcherService,
    private readonly events: AdaptiveGrowthEnterpriseEventBusService,
    private readonly workflows: AdaptiveGrowthWorkflowEngineService,
    private readonly metrics: AdaptiveGrowthMetricsService,
  ) {}

  evaluate() {
    const checks = {
      capabilityRegistry: this.registry.status().status === "operational",
      dispatcher: this.dispatcher.status().status === "operational",
      eventBus: this.events.status().status === "operational",
      workflowEngine: this.workflows.status().status === "operational",
    };

    const score =
      (Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100;

    return {
      name: "AGS Enterprise Platform Health",
      status: score === 100 ? "healthy" : score >= 75 ? "degraded" : "unhealthy",
      score,
      checks,
      metrics: this.metrics.snapshot(),
      observabilityReady: true,
      tracingReady: true,
      evaluatedAt: new Date().toISOString(),
    };
  }
}