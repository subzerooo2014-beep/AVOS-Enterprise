import { Module } from "@nestjs/common";
import { AutonomousFactoryRecoveryService } from "./autonomous-factory-recovery.service";
import { BlueprintCapabilityOptimizationService } from "./blueprint-capability-optimization.service";
import { ContinuousFactoryLearningService } from "./continuous-factory-learning.service";
import { FactoryDigitalDnaService } from "./factory-digital-dna.service";
import { FactoryEnterpriseCertificationService } from "./factory-enterprise-certification.service";
import { FactoryEvolutionEngineService } from "./factory-evolution-engine.service";
import { FactoryExperienceReplayService } from "./factory-experience-replay.service";
import { FactoryKnowledgeEvolutionController } from "./factory-knowledge-evolution.controller";
import { FactoryKnowledgeEvolutionCoordinatorService } from "./factory-knowledge-evolution-coordinator.service";
import { FactoryKnowledgeGraphService } from "./factory-knowledge-graph.service";
import { FactoryKnowledgeService } from "./factory-knowledge.service";
import { FactoryRootCauseAnalysisService } from "./factory-root-cause-analysis.service";
import { PredictiveFailureIntelligenceService } from "./predictive-failure-intelligence.service";
import { ProductionMemoryService } from "./production-memory.service";

@Module({
  controllers: [FactoryKnowledgeEvolutionController],
  providers: [
    FactoryKnowledgeService,
    ProductionMemoryService,
    ContinuousFactoryLearningService,
    FactoryExperienceReplayService,
    FactoryEvolutionEngineService,
    BlueprintCapabilityOptimizationService,
    PredictiveFailureIntelligenceService,
    FactoryRootCauseAnalysisService,
    AutonomousFactoryRecoveryService,
    FactoryDigitalDnaService,
    FactoryKnowledgeGraphService,
    FactoryEnterpriseCertificationService,
    FactoryKnowledgeEvolutionCoordinatorService,
  ],
  exports: [FactoryKnowledgeEvolutionCoordinatorService],
})
export class FactoryKnowledgeLearningEvolutionModule {}
