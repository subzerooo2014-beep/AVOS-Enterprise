import { ProductionRuntimeController } from "./production-runtime/production-runtime.controller";
import { ProductionPlatformRuntimeService } from "./production-runtime/runtime/production-platform-runtime.service";
import { WorkflowCheckpointService } from "./production-runtime/recovery/workflow-checkpoint.service";
import { ProductionRuntimeReportService } from "./production-runtime/reporting/production-runtime-report.service";
import { ProductionPersistenceService } from "./production-runtime/persistence/production-persistence.service";
import { TransactionalOutboxService } from "./production-runtime/messaging/transactional-outbox.service";
import { IdempotentInboxService } from "./production-runtime/messaging/idempotent-inbox.service";
import { RuntimeNodeRegistryService } from "./production-runtime/distributed/runtime-node-registry.service";
import { DistributedTaskRuntimeService } from "./production-runtime/distributed/distributed-task-runtime.service";
import { ProductionRuntimeCertificationService } from "./production-runtime/certification/production-runtime-certification.service";
import { UltraSuiteAdapterRegistryService } from "./production-runtime/adapters/ultra-suite-adapter-registry.service";
import { Module, OnModuleInit } from "@nestjs/common";
import { PlatformCertificationService } from "./certification/platform-certification.service";
import { UnifiedPlatformControllerService } from "./controller/unified-platform-controller.service";
import { SharedServiceDiscoveryService } from "./discovery/shared-service-discovery.service";
import { UnifiedEventBusService } from "./events/unified-event-bus.service";
import { UnifiedPlatformFoundationService } from "./foundation/unified-platform-foundation.service";
import { UnifiedApiGatewayService } from "./gateway/unified-api-gateway.service";
import { UnifiedGovernanceService } from "./governance/unified-governance.service";
import { UnifiedIdentityAccessService } from "./identity/unified-identity-access.service";
import { CrossSuiteIntelligenceService } from "./intelligence/cross-suite-intelligence.service";
import { PlatformObservabilityService } from "./observability/platform-observability.service";
import { CrossSuiteOrchestratorService } from "./orchestrator/cross-suite-orchestrator.service";
import { UnifiedPlatformRegistryService } from "./registry/unified-platform-registry.service";
import { UnifiedPlatformReportService } from "./reporting/unified-platform-report.service";
import { PlatformSmokeTestService } from "./smoke/platform-smoke-test.service";
import { UnifiedPlatformHttpController } from "./unified-platform.controller";
import { UnifiedWorkflowEngineService } from "./workflow/unified-workflow-engine.service";

@Module({
  controllers: [ProductionRuntimeController, UnifiedPlatformHttpController],
  providers: [ProductionRuntimeReportService, ProductionRuntimeCertificationService, ProductionPlatformRuntimeService, WorkflowCheckpointService, DistributedTaskRuntimeService, RuntimeNodeRegistryService, UltraSuiteAdapterRegistryService, IdempotentInboxService, TransactionalOutboxService, ProductionPersistenceService, 
    UnifiedPlatformFoundationService,
    UnifiedPlatformRegistryService,
    UnifiedPlatformControllerService,
    UnifiedEventBusService,
    UnifiedWorkflowEngineService,
    CrossSuiteOrchestratorService,
    UnifiedIdentityAccessService,
    UnifiedGovernanceService,
    UnifiedApiGatewayService,
    SharedServiceDiscoveryService,
    CrossSuiteIntelligenceService,
    PlatformObservabilityService,
    PlatformSmokeTestService,
    PlatformCertificationService,
    UnifiedPlatformReportService
  ],
  exports: [ProductionRuntimeReportService, ProductionRuntimeCertificationService, ProductionPlatformRuntimeService, DistributedTaskRuntimeService, UltraSuiteAdapterRegistryService, ProductionPersistenceService, 
    UnifiedPlatformRegistryService,
    UnifiedPlatformControllerService,
    UnifiedEventBusService,
    UnifiedWorkflowEngineService,
    CrossSuiteOrchestratorService,
    UnifiedIdentityAccessService,
    UnifiedGovernanceService,
    UnifiedApiGatewayService,
    SharedServiceDiscoveryService,
    CrossSuiteIntelligenceService,
    PlatformObservabilityService,
    PlatformCertificationService,
    UnifiedPlatformReportService
  ]
})
export class UnifiedPlatformModule implements OnModuleInit {
  constructor(
    private readonly platform: UnifiedPlatformControllerService,
    private readonly identity: UnifiedIdentityAccessService,
    private readonly gateway: UnifiedApiGatewayService
  ) {}

  onModuleInit() {
    this.identity.register("system:unified-platform", "service", ["platform:access", "platform:admin"]);
    this.gateway.registerRoute("/marketplace", "AVOS Marketplace Ultra Suite");
    this.gateway.registerRoute("/media", "AVOS Media Ultra Suite");
    this.gateway.registerRoute("/finance", "AVOS Finance Ultra Suite");
    this.gateway.registerRoute("/enterprise-brain", "AVOS Enterprise Brain Ultra Suite");
    this.gateway.registerRoute("/global-intelligence", "AVOS Global Intelligence Ultra Suite");
    this.platform.boot();
  }
}