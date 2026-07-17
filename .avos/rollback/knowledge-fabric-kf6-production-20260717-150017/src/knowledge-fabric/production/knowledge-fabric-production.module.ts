import { Module } from "@nestjs/common";
import { KnowledgeFabricProductionCertificationService } from "./certification/knowledge-fabric-production-certification.service";
import { KnowledgeFabricProductionSmokeService } from "./certification/knowledge-fabric-production-smoke.service";
import { KnowledgeFabricProductionVerificationService } from "./certification/knowledge-fabric-production-verification.service";
import { KnowledgeFabricHealthService } from "./health/knowledge-fabric-health.service";
import { CapabilityRegistryIntegration } from "./integrations/capability-registry.integration";
import { EnterpriseKernelIntegration } from "./integrations/enterprise-kernel.integration";
import { KnowledgeFabricEventBusAdapter } from "./integrations/knowledge-fabric-event-bus.adapter";
import { KnowledgeFabricMetricsService } from "./monitoring/knowledge-fabric-metrics.service";
import { KnowledgeFabricProductionBootstrap } from "./knowledge-fabric-production.bootstrap";
import { KnowledgeFabricProductionController } from "./knowledge-fabric-production.controller";
import { KnowledgeFabricOrchestratorService } from "./orchestrator/knowledge-fabric-orchestrator.service";
import { UnifiedSearchPipelineService } from "./pipeline/unified-search-pipeline.service";
import { UnifiedKnowledgeRegistryService } from "./registry/unified-knowledge-registry.service";
import { KnowledgeFabricRuntimeService } from "./runtime/knowledge-fabric-runtime.service";

@Module({
  controllers: [KnowledgeFabricProductionController],
  providers: [
    KnowledgeFabricRuntimeService,
    UnifiedKnowledgeRegistryService,
    UnifiedSearchPipelineService,
    KnowledgeFabricEventBusAdapter,
    EnterpriseKernelIntegration,
    CapabilityRegistryIntegration,
    KnowledgeFabricMetricsService,
    KnowledgeFabricOrchestratorService,
    KnowledgeFabricHealthService,
    KnowledgeFabricProductionVerificationService,
    KnowledgeFabricProductionSmokeService,
    KnowledgeFabricProductionCertificationService,
    KnowledgeFabricProductionBootstrap,
  ],
  exports: [
    KnowledgeFabricRuntimeService,
    UnifiedKnowledgeRegistryService,
    UnifiedSearchPipelineService,
    KnowledgeFabricOrchestratorService,
    KnowledgeFabricMetricsService,
    KnowledgeFabricHealthService,
    KnowledgeFabricProductionVerificationService,
    KnowledgeFabricProductionSmokeService,
    KnowledgeFabricProductionCertificationService,
  ],
})
export class KnowledgeFabricProductionModule {}