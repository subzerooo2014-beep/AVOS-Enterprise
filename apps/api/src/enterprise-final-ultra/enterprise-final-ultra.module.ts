import { Module } from "@nestjs/common";
import { AiArchitectureEvolutionService } from "./ai-architecture-evolution.service";
import { AiExecutiveBoardService } from "./ai-executive-board.service";
import { AutonomousCodeImprovementService } from "./autonomous-code-improvement.service";
import { AutonomousEnterpriseAgentsService } from "./autonomous-enterprise-agents.service";
import { AvosVoiceOsService } from "./avos-voice-os.service";
import { DigitalHumanEngineService } from "./digital-human-engine.service";
import { EnterpriseCertificationService } from "./enterprise-certification.service";
import { EnterpriseFinalUltraController } from "./enterprise-final-ultra.controller";
import { EnterpriseFinalUltraOrchestratorService } from "./enterprise-final-ultra-orchestrator.service";
import { EnterpriseOsFinalIntegrationService } from "./enterprise-os-final-integration.service";
import { GlobalAiSwarmService } from "./global-ai-swarm.service";
import { GlobalRuntimeService } from "./global-runtime.service";
import { MultimodalIntelligenceService } from "./multimodal-intelligence.service";
import { ProductionLockService } from "./production-lock.service";
import { SelfEvolutionEngineService } from "./self-evolution-engine.service";

@Module({
  controllers: [EnterpriseFinalUltraController],
  providers: [
    GlobalAiSwarmService,
    AutonomousEnterpriseAgentsService,
    AiExecutiveBoardService,
    AvosVoiceOsService,
    DigitalHumanEngineService,
    MultimodalIntelligenceService,
    SelfEvolutionEngineService,
    AutonomousCodeImprovementService,
    AiArchitectureEvolutionService,
    EnterpriseOsFinalIntegrationService,
    GlobalRuntimeService,
    EnterpriseCertificationService,
    ProductionLockService,
    EnterpriseFinalUltraOrchestratorService,
  ],
  exports: [
    GlobalAiSwarmService,
    AutonomousEnterpriseAgentsService,
    AiExecutiveBoardService,
    AvosVoiceOsService,
    DigitalHumanEngineService,
    MultimodalIntelligenceService,
    SelfEvolutionEngineService,
    AutonomousCodeImprovementService,
    AiArchitectureEvolutionService,
    EnterpriseOsFinalIntegrationService,
    GlobalRuntimeService,
    EnterpriseCertificationService,
    ProductionLockService,
    EnterpriseFinalUltraOrchestratorService,
  ],
})
export class EnterpriseFinalUltraModule {}