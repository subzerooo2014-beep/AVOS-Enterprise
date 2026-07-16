import { Injectable } from "@nestjs/common";
import { FoundationBootstrapOrchestratorV1Service } from "./foundation-bootstrap-orchestrator-v1.service";
import { FoundationExecutionIntegrationV1Service } from "./foundation-execution-integration-v1.service";
import { FoundationHealthAggregationV1Service } from "./foundation-health-aggregation-v1.service";
import { FoundationEventIntegrationV1Service } from "./foundation-event-integration-v1.service";
import { FoundationUnifiedCapabilityRegistryV1Service } from "./foundation-unified-capability-registry-v1.service";
import { FoundationUnifiedModuleRegistryV1Service } from "./foundation-unified-module-registry-v1.service";
import type {
  FoundationIntegrationMetricsV1,
  FoundationIntegrationStatusV1,
} from "./foundation-integration-platform-v1.types";

@Injectable()
export class FoundationIntegrationPlatformV1Service {
  constructor(
    private readonly modules: FoundationUnifiedModuleRegistryV1Service,
    private readonly capabilities: FoundationUnifiedCapabilityRegistryV1Service,
    private readonly bootstrap: FoundationBootstrapOrchestratorV1Service,
    private readonly events: FoundationEventIntegrationV1Service,
    private readonly executions: FoundationExecutionIntegrationV1Service,
    private readonly health: FoundationHealthAggregationV1Service,
  ) {}

  metrics(): FoundationIntegrationMetricsV1 {
    return {
      modules: this.modules.count(),
      readyModules: this.modules.readyCount(),
      capabilities: this.capabilities.count(),
      availableCapabilities: this.capabilities.availableCount(),
      bootstrapSteps: this.bootstrap.count(),
      completedBootstrapSteps: this.bootstrap.completedCount(),
      events: this.events.count(),
      executionRequests: this.executions.count(),
      completedExecutions: this.executions.completedCount(),
      failedExecutions: this.executions.failedCount(),
      healthComponents: this.health.count(),
      unhealthyComponents: this.health.unhealthyCount(),
    };
  }

  status(): FoundationIntegrationStatusV1 {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Foundation Integration Platform V1",
      version: "1.0.0",
      status:
        metrics.failedExecutions > 0 ||
        metrics.unhealthyComponents > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        foundationIntegrationOrchestrator: "READY",
        startupOrchestrator: "READY",
        runtimeDependencyResolver: "READY",
        unifiedCapabilityRegistry: "READY",
        unifiedModuleRegistry: "READY",
        eventBusIntegration: "READY",
        workflowRulesPolicyIntegration: "READY",
        aiCoreIntegration: "READY",
        healthAggregation: "READY",
        bootstrapManager: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      status: this.status(),
      modules: this.modules.list(),
      capabilities: this.capabilities.list(),
      bootstrapSteps: this.bootstrap.list(),
      events: this.events.replay(),
      executions: this.executions.list(),
      health: this.health.aggregate(),
    };
  }
}
