import { Module } from "@nestjs/common";
import { IntelligenceFabricModule } from "../intelligence-fabric.module";
import { UnifiedIntelligenceDecisionEngineService } from "./decision/unified-intelligence-decision-engine.service";
import { IntelligenceOrchestrationEventBusService } from "./events/intelligence-orchestration-event-bus.service";
import { IntelligenceEngineExecutorService } from "./execution/intelligence-engine-executor.service";
import { UnifiedIntelligenceHealthService } from "./health/unified-intelligence-health.service";
import { CapabilityFabricIntelligenceAdapter } from "./integration/capability-fabric-intelligence.adapter";
import { KnowledgeFabricIntelligenceAdapter } from "./integration/knowledge-fabric-intelligence.adapter";
import { IntelligenceFabricOrchestrationController } from "./intelligence-fabric-orchestration.controller";
import { UnifiedIntelligenceObservabilityService } from "./monitoring/unified-intelligence-observability.service";
import { UnifiedIntelligenceOrchestratorService } from "./orchestrator/unified-intelligence-orchestrator.service";
import { UnifiedIntelligenceEngineRegistryService } from "./registry/unified-intelligence-engine-registry.service";
import { UnifiedIntelligenceRouterService } from "./routing/unified-intelligence-router.service";
import { IntelligenceOrchestrationCertificationService } from "./verification/intelligence-orchestration-certification.service";
import { IntelligenceOrchestrationSmokeService } from "./verification/intelligence-orchestration-smoke.service";
import { IntelligenceOrchestrationVerificationService } from "./verification/intelligence-orchestration-verification.service";

@Module({
  imports: [IntelligenceFabricModule],
  controllers: [IntelligenceFabricOrchestrationController],
  providers: [
    UnifiedIntelligenceEngineRegistryService,
    UnifiedIntelligenceRouterService,
    IntelligenceEngineExecutorService,
    UnifiedIntelligenceDecisionEngineService,
    KnowledgeFabricIntelligenceAdapter,
    CapabilityFabricIntelligenceAdapter,
    IntelligenceOrchestrationEventBusService,
    UnifiedIntelligenceObservabilityService,
    UnifiedIntelligenceOrchestratorService,
    UnifiedIntelligenceHealthService,
    IntelligenceOrchestrationVerificationService,
    IntelligenceOrchestrationSmokeService,
    IntelligenceOrchestrationCertificationService,
  ],
  exports: [
    UnifiedIntelligenceEngineRegistryService,
    UnifiedIntelligenceRouterService,
    IntelligenceEngineExecutorService,
    UnifiedIntelligenceDecisionEngineService,
    KnowledgeFabricIntelligenceAdapter,
    CapabilityFabricIntelligenceAdapter,
    IntelligenceOrchestrationEventBusService,
    UnifiedIntelligenceObservabilityService,
    UnifiedIntelligenceOrchestratorService,
    UnifiedIntelligenceHealthService,
    IntelligenceOrchestrationVerificationService,
    IntelligenceOrchestrationSmokeService,
    IntelligenceOrchestrationCertificationService,
  ],
})
export class IntelligenceFabricOrchestrationModule {}