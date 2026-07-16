import { Injectable } from "@nestjs/common";
import { EventPlatformCatalogService } from "./event-platform-catalog.service";
import { EventPlatformGovernanceService } from "./event-platform-governance.service";
import type { EventPlatformHealth } from "./event-platform-integration.types";
import { EventPlatformObservabilityService } from "./event-platform-observability.service";
import { EventPlatformRoutingService } from "./event-platform-routing.service";

@Injectable()
export class EventPlatformIntegrationService {
  constructor(
    private readonly catalog: EventPlatformCatalogService,
    private readonly routing: EventPlatformRoutingService,
    private readonly governance: EventPlatformGovernanceService,
    private readonly observability: EventPlatformObservabilityService,
  ) {}

  health(): EventPlatformHealth {
    const governance = this.governance.validate();
    const metrics = this.catalog.metrics(this.routing.count());

    return {
      success: true,
      system: "AVOS Event Platform Integration",
      version: "1.0.0",
      status: governance.compliant ? "READY" : "DEGRADED",
      metrics,
      components: {
        discovery: "READY",
        catalog: "READY",
        schemaRegistry: "READY",
        versionManager: "READY",
        routingCenter: "READY",
        crossModuleBridge: "READY",
        observability: "READY",
        analytics: "READY",
        governance: governance.compliant ? "READY" : "DEGRADED",
        replayOrchestration: "INTEGRATION_READY",
        lifecycleManager: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      discovery: this.catalog.discoveryStatus(),
      governance: this.governance.validate(),
      domains: this.catalog.domains(),
      routes: this.routing.list(),
      analytics: this.observability.analytics(),
      observations: this.observability.list(50),
    };
  }
}
