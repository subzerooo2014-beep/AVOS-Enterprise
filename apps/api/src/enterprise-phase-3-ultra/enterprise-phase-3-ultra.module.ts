import { Module } from "@nestjs/common";
import { AiScenarioSimulatorService } from "./ai-scenario-simulator.service";
import { AutonomousPartnerNetworkService } from "./autonomous-partner-network.service";
import { ContextMemoryEngineService } from "./context-memory-engine.service";
import { DynamicRegulationEngineService } from "./dynamic-regulation-engine.service";
import { EnterpriseKnowledgeGraphService } from "./enterprise-knowledge-graph.service";
import { EnterpriseObservabilityService } from "./enterprise-observability.service";
import { EnterprisePhase3UltraController } from "./enterprise-phase-3-ultra.controller";
import { EnterprisePhase3UltraOrchestratorService } from "./enterprise-phase-3-ultra-orchestrator.service";
import { ExperienceComposerAiService } from "./experience-composer-ai.service";
import { GlobalStandardsObservatoryService } from "./global-standards-observatory.service";
import { PredictiveMaintenanceEngineService } from "./predictive-maintenance-engine.service";
import { SelfHealingPlatformService } from "./self-healing-platform.service";

@Module({
  controllers: [EnterprisePhase3UltraController],
  providers: [
    EnterpriseKnowledgeGraphService,
    ContextMemoryEngineService,
    AiScenarioSimulatorService,
    DynamicRegulationEngineService,
    AutonomousPartnerNetworkService,
    ExperienceComposerAiService,
    PredictiveMaintenanceEngineService,
    SelfHealingPlatformService,
    EnterpriseObservabilityService,
    GlobalStandardsObservatoryService,
    EnterprisePhase3UltraOrchestratorService,
  ],
  exports: [
    EnterpriseKnowledgeGraphService,
    ContextMemoryEngineService,
    AiScenarioSimulatorService,
    DynamicRegulationEngineService,
    AutonomousPartnerNetworkService,
    ExperienceComposerAiService,
    PredictiveMaintenanceEngineService,
    SelfHealingPlatformService,
    EnterpriseObservabilityService,
    GlobalStandardsObservatoryService,
    EnterprisePhase3UltraOrchestratorService,
  ],
})
export class EnterprisePhase3UltraModule {}