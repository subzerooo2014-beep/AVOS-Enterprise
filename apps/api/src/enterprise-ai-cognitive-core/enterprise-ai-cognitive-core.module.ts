import { Module } from '@nestjs/common';
import { EnterpriseAiCognitiveCoreController } from './enterprise-ai-cognitive-core.controller';
import { EnterpriseCognitiveEngineService } from './enterprise-cognitive-engine.service';
import { AutonomousReasoningEngineService } from './autonomous-reasoning-engine.service';
import { KnowledgeSynthesisEngineService } from './knowledge-synthesis-engine.service';
import { EnterpriseMemoryGraphV2Service } from './enterprise-memory-graph-v2.service';
import { LongTermEnterpriseMemoryService } from './long-term-enterprise-memory.service';
import { MultiAgentCollaborationCoreService } from './multi-agent-collaboration-core.service';
import { AutonomousGoalManagementService } from './autonomous-goal-management.service';
import { EnterpriseLearningEngineService } from './enterprise-learning-engine.service';
import { DecisionExplainabilityEngineService } from './decision-explainability-engine.service';
import { StrategicPlanningIntelligenceService } from './strategic-planning-intelligence.service';
import { CognitiveWorkflowOrchestratorService } from './cognitive-workflow-orchestrator.service';
import { EnterpriseCognitiveDashboardService } from './enterprise-cognitive-dashboard.service';
import { CognitiveAnalyticsCenterService } from './cognitive-analytics-center.service';

@Module({
  controllers: [EnterpriseAiCognitiveCoreController],
  providers: [
    EnterpriseCognitiveEngineService,
    AutonomousReasoningEngineService,
    KnowledgeSynthesisEngineService,
    EnterpriseMemoryGraphV2Service,
    LongTermEnterpriseMemoryService,
    MultiAgentCollaborationCoreService,
    AutonomousGoalManagementService,
    EnterpriseLearningEngineService,
    DecisionExplainabilityEngineService,
    StrategicPlanningIntelligenceService,
    CognitiveWorkflowOrchestratorService,
    EnterpriseCognitiveDashboardService,
    CognitiveAnalyticsCenterService,
  ],
  exports: [
    EnterpriseCognitiveEngineService,
    AutonomousReasoningEngineService,
    KnowledgeSynthesisEngineService,
    EnterpriseMemoryGraphV2Service,
    LongTermEnterpriseMemoryService,
    MultiAgentCollaborationCoreService,
    AutonomousGoalManagementService,
    EnterpriseLearningEngineService,
    DecisionExplainabilityEngineService,
    StrategicPlanningIntelligenceService,
    CognitiveWorkflowOrchestratorService,
    EnterpriseCognitiveDashboardService,
    CognitiveAnalyticsCenterService,
  ],
})
export class EnterpriseAiCognitiveCoreModule {}