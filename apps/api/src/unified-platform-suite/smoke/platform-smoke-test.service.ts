import { Injectable } from "@nestjs/common";
import { UnifiedApiGatewayService } from "../gateway/unified-api-gateway.service";
import { UnifiedEventBusService } from "../events/unified-event-bus.service";
import { UnifiedIdentityAccessService } from "../identity/unified-identity-access.service";
import { PlatformObservabilityService } from "../observability/platform-observability.service";
import { UnifiedPlatformControllerService } from "../controller/unified-platform-controller.service";
import { UnifiedPlatformRegistryService } from "../registry/unified-platform-registry.service";
import { UnifiedWorkflowEngineService } from "../workflow/unified-workflow-engine.service";

@Injectable()
export class PlatformSmokeTestService {
  constructor(
    private readonly controller: UnifiedPlatformControllerService,
    private readonly registry: UnifiedPlatformRegistryService,
    private readonly gateway: UnifiedApiGatewayService,
    private readonly events: UnifiedEventBusService,
    private readonly workflows: UnifiedWorkflowEngineService,
    private readonly identity: UnifiedIdentityAccessService,
    private readonly observability: PlatformObservabilityService
  ) {}

  run() {
    const status = this.controller.status();
    const checks = {
      controllerTest: status.status === "operational",
      registryTest: this.registry.list("suite").length >= 5,
      apiTest: this.gateway.metrics().versioning === true,
      eventBusTest: this.events.metrics().totalEvents >= 0,
      workflowTest: Array.isArray(this.workflows.listRuns()),
      identityTest: this.identity.summary().total >= 1,
      dashboardTest: Boolean(this.observability.dashboard().platformHealth)
    };
    const passed = Object.values(checks).every(Boolean);
    return {
      id: `unified-platform-smoke-${Date.now()}`,
      status: passed ? "passed" : "failed",
      score: Math.round((Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100),
      checks,
      executedAt: new Date().toISOString()
    };
  }
}