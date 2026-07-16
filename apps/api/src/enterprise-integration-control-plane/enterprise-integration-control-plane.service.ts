import { Injectable, OnModuleInit } from "@nestjs/common";
import { IntegrationCatalogService } from "./integration-catalog.service";
import { IntegrationExecutionObservabilityService } from "./integration-execution-observability.service";
import { IntegrationGovernanceService } from "./integration-governance.service";
import { IntegrationProviderRegistryService } from "./integration-provider-registry.service";
import { IntegrationRoutingService } from "./integration-routing.service";
import type {
  IntegrationControlPlaneHealth,
  IntegrationControlPlaneMetrics,
} from "./enterprise-integration-control-plane.types";

@Injectable()
export class EnterpriseIntegrationControlPlaneService
  implements OnModuleInit
{
  constructor(
    private readonly catalog: IntegrationCatalogService,
    private readonly providers: IntegrationProviderRegistryService,
    private readonly routing: IntegrationRoutingService,
    private readonly observability: IntegrationExecutionObservabilityService,
    private readonly governance: IntegrationGovernanceService,
  ) {}

  onModuleInit(): void {
    this.providers.sync(this.catalog.list());
  }

  refresh() {
    const components = this.catalog.refresh();
    const providers = this.providers.sync(components);

    return {
      success: true,
      components: components.length,
      providers: providers.length,
    };
  }

  metrics(): IntegrationControlPlaneMetrics {
    const analytics = this.observability.analytics();
    const providerList = this.providers.list();

    return {
      components: this.catalog.count(),
      providers: this.providers.count(),
      routes: this.routing.count(),
      executions: analytics.executions,
      completed: analytics.completed,
      failed: analytics.failed,
      healthyProviders: providerList.filter(
        (item) => item.health === "HEALTHY",
      ).length,
      degradedProviders: providerList.filter(
        (item) => item.health === "DEGRADED",
      ).length,
    };
  }

  health(): IntegrationControlPlaneHealth {
    const governance = this.governance.validate();
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Integration Control Plane",
      version: "1.0.0",
      status: governance.compliant ? "READY" : "DEGRADED",
      metrics,
      components: {
        discovery: "READY",
        catalog: "READY",
        providerRegistry: "READY",
        serviceDiscovery: "READY",
        routing: "READY",
        webhookOrchestration: "READY",
        versionManagement: "READY",
        observability: "READY",
        analytics: "READY",
        governance: governance.compliant ? "READY" : "DEGRADED",
        gatewayUnification: "INTEGRATION_READY",
        connectorFramework: "INTEGRATION_READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      discovery: this.catalog.status(),
      providers: this.providers.list(),
      routes: this.routing.list(),
      executions: this.observability.list(),
      governance: this.governance.validate(),
    };
  }
}
