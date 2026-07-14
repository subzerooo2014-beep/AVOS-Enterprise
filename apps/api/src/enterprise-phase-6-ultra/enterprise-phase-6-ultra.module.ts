import { Module } from "@nestjs/common";
import { AdaptivePricingIntelligenceService } from "./adaptive-pricing-intelligence.service";
import { AiCollaborationMeshV2Service } from "./ai-collaboration-mesh-v2.service";
import { AiValueCreationEngineService } from "./ai-value-creation-engine.service";
import { AutonomousEcosystemGenomeService } from "./autonomous-ecosystem-genome.service";
import { CustomerJourneyGenomeV2Service } from "./customer-journey-genome-v2.service";
import { DynamicMarketplaceComposerV2Service } from "./dynamic-marketplace-composer-v2.service";
import { EnterpriseDigitalMemoryVaultV2Service } from "./enterprise-digital-memory-vault-v2.service";
import { EnterprisePhase6UltraController } from "./enterprise-phase-6-ultra.controller";
import { EnterprisePhase6UltraOrchestratorService } from "./enterprise-phase-6-ultra-orchestrator.service";
import { IntelligentServiceOrchestratorV2Service } from "./intelligent-service-orchestrator-v2.service";
import { PlatformEvolutionIndexV2Service } from "./platform-evolution-index-v2.service";
import { PredictiveDemandWaveEngineService } from "./predictive-demand-wave-engine.service";

@Module({
  controllers: [EnterprisePhase6UltraController],
  providers: [
    AutonomousEcosystemGenomeService,
    AiValueCreationEngineService,
    PredictiveDemandWaveEngineService,
    AiCollaborationMeshV2Service,
    DynamicMarketplaceComposerV2Service,
    CustomerJourneyGenomeV2Service,
    EnterpriseDigitalMemoryVaultV2Service,
    IntelligentServiceOrchestratorV2Service,
    AdaptivePricingIntelligenceService,
    PlatformEvolutionIndexV2Service,
    EnterprisePhase6UltraOrchestratorService,
  ],
  exports: [
    AutonomousEcosystemGenomeService,
    AiValueCreationEngineService,
    PredictiveDemandWaveEngineService,
    AiCollaborationMeshV2Service,
    DynamicMarketplaceComposerV2Service,
    CustomerJourneyGenomeV2Service,
    EnterpriseDigitalMemoryVaultV2Service,
    IntelligentServiceOrchestratorV2Service,
    AdaptivePricingIntelligenceService,
    PlatformEvolutionIndexV2Service,
    EnterprisePhase6UltraOrchestratorService,
  ],
})
export class EnterprisePhase6UltraModule {}