import { Module } from "@nestjs/common";
import { AdaptiveOptimizationEngineService } from "./adaptive-optimization-engine.service";
import { AiStrategicPlannerService } from "./ai-strategic-planner.service";
import { AutonomousWorkflowIntelligenceService } from "./autonomous-workflow-intelligence.service";
import { ContinuousLearningEngineService } from "./continuous-learning-engine.service";
import { EnterpriseDecisionGraphService } from "./enterprise-decision-graph.service";
import { EnterpriseDigitalTwinService } from "./enterprise-digital-twin.service";
import { EnterpriseGovernanceMeshService } from "./enterprise-governance-mesh.service";
import { EnterprisePhase4UltraController } from "./enterprise-phase-4-ultra.controller";
import { EnterprisePhase4UltraOrchestratorService } from "./enterprise-phase-4-ultra-orchestrator.service";
import { EnterprisePlanningEngineService } from "./enterprise-planning-engine.service";
import { EnterpriseReasoningEngineService } from "./enterprise-reasoning-engine.service";
import { EnterpriseResilienceLaboratoryService } from "./enterprise-resilience-laboratory.service";

@Module({
  controllers: [EnterprisePhase4UltraController],
  providers: [
    EnterpriseDigitalTwinService,
    EnterprisePlanningEngineService,
    EnterpriseReasoningEngineService,
    EnterpriseDecisionGraphService,
    AiStrategicPlannerService,
    EnterpriseResilienceLaboratoryService,
    AutonomousWorkflowIntelligenceService,
    EnterpriseGovernanceMeshService,
    ContinuousLearningEngineService,
    AdaptiveOptimizationEngineService,
    EnterprisePhase4UltraOrchestratorService,
  ],
  exports: [
    EnterpriseDigitalTwinService,
    EnterprisePlanningEngineService,
    EnterpriseReasoningEngineService,
    EnterpriseDecisionGraphService,
    AiStrategicPlannerService,
    EnterpriseResilienceLaboratoryService,
    AutonomousWorkflowIntelligenceService,
    EnterpriseGovernanceMeshService,
    ContinuousLearningEngineService,
    AdaptiveOptimizationEngineService,
    EnterprisePhase4UltraOrchestratorService,
  ],
})
export class EnterprisePhase4UltraModule {}