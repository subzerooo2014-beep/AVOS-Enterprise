import { Module } from "@nestjs/common";
import { EventMeshFileStoreService } from "./event-mesh-file-store.service";
import { EventRegistryService } from "./event-registry.service";
import { UnifiedMessagingService } from "./unified-messaging.service";
import { EventContractsService } from "./event-contracts.service";
import { EventObservabilityService } from "./event-observability.service";
import { EventRoutingService } from "./event-routing.service";
import { EventStreamsService } from "./event-streams.service";
import { WorkflowIntegrationService } from "./workflow-integration.service";
import { DistributedCoordinationService } from "./distributed-coordination.service";
import { PlatformAutomationService } from "./platform-automation.service";
import { DeadLetterManagementService } from "./dead-letter-management.service";
import { PlatformEventMeshService } from "./platform-event-mesh.service";
import { PlatformProductionMegaPack4StatusService } from "./platform-production-mega-pack-4-status.service";
import { PlatformProductionMegaPack4AssuranceService } from "./platform-production-mega-pack-4-assurance.service";
import { PlatformProductionMegaPack4Controller } from "./platform-production-mega-pack-4.controller";

@Module({
  controllers: [PlatformProductionMegaPack4Controller],
  providers: [
    EventMeshFileStoreService,
    EventRegistryService,
    UnifiedMessagingService,
    EventContractsService,
    EventObservabilityService,
    EventRoutingService,
    EventStreamsService,
    WorkflowIntegrationService,
    DistributedCoordinationService,
    PlatformAutomationService,
    DeadLetterManagementService,
    PlatformEventMeshService,
    PlatformProductionMegaPack4StatusService,
    PlatformProductionMegaPack4AssuranceService,
  ],
  exports: [
    EventRegistryService,
    UnifiedMessagingService,
    EventContractsService,
    EventRoutingService,
    EventStreamsService,
    WorkflowIntegrationService,
    DistributedCoordinationService,
    PlatformAutomationService,
    DeadLetterManagementService,
    EventObservabilityService,
    PlatformEventMeshService,
    PlatformProductionMegaPack4StatusService,
  ],
})
export class PlatformProductionMegaPack4Module {}