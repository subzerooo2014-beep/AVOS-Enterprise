import { Module } from "@nestjs/common";
import { ConfigurationCenterService } from "./configuration-center.service";
import { EnterprisePlatformServicesControlPlaneController } from "./enterprise-platform-services-control-plane.controller";
import { EnterprisePlatformServicesControlPlaneService } from "./enterprise-platform-services-control-plane.service";
import { FeatureFlagService } from "./feature-flag.service";
import { NotificationOrchestratorService } from "./notification-orchestrator.service";
import { PlatformServicesCatalogService } from "./platform-services-catalog.service";
import { PlatformServicesDiscoveryService } from "./platform-services-discovery.service";
import { PlatformServicesGovernanceService } from "./platform-services-governance.service";
import { PlatformServicesObservabilityService } from "./platform-services-observability.service";
import { SchedulerControlService } from "./scheduler-control.service";
import { TenantContextService } from "./tenant-context.service";

@Module({
  controllers: [EnterprisePlatformServicesControlPlaneController],
  providers: [
    ConfigurationCenterService,
    EnterprisePlatformServicesControlPlaneService,
    FeatureFlagService,
    NotificationOrchestratorService,
    PlatformServicesCatalogService,
    PlatformServicesDiscoveryService,
    PlatformServicesGovernanceService,
    PlatformServicesObservabilityService,
    SchedulerControlService,
    TenantContextService,
  ],
  exports: [
    ConfigurationCenterService,
    EnterprisePlatformServicesControlPlaneService,
    FeatureFlagService,
    NotificationOrchestratorService,
    PlatformServicesCatalogService,
    PlatformServicesDiscoveryService,
    PlatformServicesGovernanceService,
    PlatformServicesObservabilityService,
    SchedulerControlService,
    TenantContextService,
  ],
})
export class EnterprisePlatformServicesControlPlaneModule {}
