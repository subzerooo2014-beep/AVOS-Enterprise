import { Module } from "@nestjs/common";
import { MobilityDnaGraphService } from "./mobility-dna-graph.service";
import { ContextMemoryEngineService } from "./context-memory-engine.service";
import { AutonomousPartnerNetworkService } from "./autonomous-partner-network.service";
import { DynamicRegulationEngineService } from "./dynamic-regulation-engine.service";
import { AiScenarioSimulatorService } from "./ai-scenario-simulator.service";
import { ExperienceComposerAiService } from "./experience-composer-ai.service";
import { CapabilityFusionEngineService } from "./capability-fusion-engine.service";
import { ZeroTouchBusinessFlowService } from "./zero-touch-business-flow.service";
import { PredictiveDemandWaveEngineService } from "./predictive-demand-wave-engine.service";
import { AiCollaborationMeshService } from "./ai-collaboration-mesh.service";
import { DynamicMarketplaceComposerService } from "./dynamic-marketplace-composer.service";
import { EnterpriseDigitalMemoryVaultService } from "./enterprise-digital-memory-vault.service";
import { CustomerJourneyGenomeService } from "./customer-journey-genome.service";
import { IntelligentServiceOrchestratorService } from "./intelligent-service-orchestrator.service";
import { AdaptivePricingIntelligenceService } from "./adaptive-pricing-intelligence.service";
import { ResourceOptimizationBrainService } from "./resource-optimization-brain.service";
import { PlatformEvolutionIndexService } from "./platform-evolution-index.service";
import { EnterpriseValueCreationEngineService } from "./enterprise-value-creation-engine.service";
import { EcosystemGenomeService } from "./ecosystem-genome.service";

@Module({
  providers: [
    MobilityDnaGraphService,
    ContextMemoryEngineService,
    AutonomousPartnerNetworkService,
    DynamicRegulationEngineService,
    AiScenarioSimulatorService,
    ExperienceComposerAiService,
    CapabilityFusionEngineService,
    ZeroTouchBusinessFlowService,
    PredictiveDemandWaveEngineService,
    AiCollaborationMeshService,
    DynamicMarketplaceComposerService,
    EnterpriseDigitalMemoryVaultService,
    CustomerJourneyGenomeService,
    IntelligentServiceOrchestratorService,
    AdaptivePricingIntelligenceService,
    ResourceOptimizationBrainService,
    PlatformEvolutionIndexService,
    EnterpriseValueCreationEngineService,
    EcosystemGenomeService,
  ],
  exports: [
    MobilityDnaGraphService,
    ContextMemoryEngineService,
    AutonomousPartnerNetworkService,
    DynamicRegulationEngineService,
    AiScenarioSimulatorService,
    ExperienceComposerAiService,
    CapabilityFusionEngineService,
    ZeroTouchBusinessFlowService,
    PredictiveDemandWaveEngineService,
    AiCollaborationMeshService,
    DynamicMarketplaceComposerService,
    EnterpriseDigitalMemoryVaultService,
    CustomerJourneyGenomeService,
    IntelligentServiceOrchestratorService,
    AdaptivePricingIntelligenceService,
    ResourceOptimizationBrainService,
    PlatformEvolutionIndexService,
    EnterpriseValueCreationEngineService,
    EcosystemGenomeService,
  ],
})
export class VehicleEvolutionIntelligenceModule {}
