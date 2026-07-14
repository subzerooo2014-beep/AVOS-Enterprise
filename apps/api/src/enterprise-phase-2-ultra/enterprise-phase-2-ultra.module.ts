import { Module } from "@nestjs/common";
import { AiCollaborationMeshService } from "./ai-collaboration-mesh.service";
import { CapabilityFusionService } from "./capability-fusion.service";
import { CustomerJourneyGenomeService } from "./customer-journey-genome.service";
import { DynamicMarketplaceComposerService } from "./dynamic-marketplace-composer.service";
import { EnterpriseDigitalMemoryVaultService } from "./enterprise-digital-memory-vault.service";
import { EnterprisePhase2UltraController } from "./enterprise-phase-2-ultra.controller";
import { EnterprisePhase2UltraOrchestratorService } from "./enterprise-phase-2-ultra-orchestrator.service";
import { IntelligentServiceOrchestratorService } from "./intelligent-service-orchestrator.service";
import { PlatformEvolutionIndexService } from "./platform-evolution-index.service";
import { PredictiveDemandWaveService } from "./predictive-demand-wave.service";
import { ResourceOptimizationBrainService } from "./resource-optimization-brain.service";
import { ZeroTouchBusinessFlowService } from "./zero-touch-business-flow.service";

@Module({
  controllers: [EnterprisePhase2UltraController],
  providers: [
    CapabilityFusionService,
    ResourceOptimizationBrainService,
    PredictiveDemandWaveService,
    AiCollaborationMeshService,
    DynamicMarketplaceComposerService,
    EnterpriseDigitalMemoryVaultService,
    CustomerJourneyGenomeService,
    IntelligentServiceOrchestratorService,
    PlatformEvolutionIndexService,
    ZeroTouchBusinessFlowService,
    EnterprisePhase2UltraOrchestratorService,
  ],
  exports: [
    CapabilityFusionService,
    ResourceOptimizationBrainService,
    PredictiveDemandWaveService,
    AiCollaborationMeshService,
    DynamicMarketplaceComposerService,
    EnterpriseDigitalMemoryVaultService,
    CustomerJourneyGenomeService,
    IntelligentServiceOrchestratorService,
    PlatformEvolutionIndexService,
    ZeroTouchBusinessFlowService,
    EnterprisePhase2UltraOrchestratorService,
  ],
})
export class EnterprisePhase2UltraModule {}