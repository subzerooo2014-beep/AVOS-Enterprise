import { Module } from "@nestjs/common";
import { EnterpriseIntegrationControlPlaneController } from "./enterprise-integration-control-plane.controller";
import { EnterpriseIntegrationControlPlaneService } from "./enterprise-integration-control-plane.service";
import { IntegrationCatalogService } from "./integration-catalog.service";
import { IntegrationDiscoveryService } from "./integration-discovery.service";
import { IntegrationExecutionObservabilityService } from "./integration-execution-observability.service";
import { IntegrationGovernanceService } from "./integration-governance.service";
import { IntegrationProviderRegistryService } from "./integration-provider-registry.service";
import { IntegrationRoutingService } from "./integration-routing.service";
import { IntegrationVersionManagerService } from "./integration-version-manager.service";
import { WebhookOrchestratorService } from "./webhook-orchestrator.service";

@Module({
  controllers: [EnterpriseIntegrationControlPlaneController],
  providers: [
    EnterpriseIntegrationControlPlaneService,
    IntegrationCatalogService,
    IntegrationDiscoveryService,
    IntegrationExecutionObservabilityService,
    IntegrationGovernanceService,
    IntegrationProviderRegistryService,
    IntegrationRoutingService,
    IntegrationVersionManagerService,
    WebhookOrchestratorService,
  ],
  exports: [
    EnterpriseIntegrationControlPlaneService,
    IntegrationCatalogService,
    IntegrationDiscoveryService,
    IntegrationExecutionObservabilityService,
    IntegrationGovernanceService,
    IntegrationProviderRegistryService,
    IntegrationRoutingService,
    IntegrationVersionManagerService,
    WebhookOrchestratorService,
  ],
})
export class EnterpriseIntegrationControlPlaneModule {}
