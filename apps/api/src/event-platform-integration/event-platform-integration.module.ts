import { Module } from "@nestjs/common";
import { EventPlatformBridgeService } from "./event-platform-bridge.service";
import { EventPlatformCatalogService } from "./event-platform-catalog.service";
import { EventPlatformDiscoveryService } from "./event-platform-discovery.service";
import { EventPlatformGovernanceService } from "./event-platform-governance.service";
import { EventPlatformIntegrationController } from "./event-platform-integration.controller";
import { EventPlatformIntegrationService } from "./event-platform-integration.service";
import { EventPlatformObservabilityService } from "./event-platform-observability.service";
import { EventPlatformRoutingService } from "./event-platform-routing.service";

@Module({
  controllers: [EventPlatformIntegrationController],
  providers: [
    EventPlatformBridgeService,
    EventPlatformCatalogService,
    EventPlatformDiscoveryService,
    EventPlatformGovernanceService,
    EventPlatformIntegrationService,
    EventPlatformObservabilityService,
    EventPlatformRoutingService,
  ],
  exports: [
    EventPlatformBridgeService,
    EventPlatformCatalogService,
    EventPlatformDiscoveryService,
    EventPlatformGovernanceService,
    EventPlatformIntegrationService,
    EventPlatformObservabilityService,
    EventPlatformRoutingService,
  ],
})
export class EventPlatformIntegrationModule {}
