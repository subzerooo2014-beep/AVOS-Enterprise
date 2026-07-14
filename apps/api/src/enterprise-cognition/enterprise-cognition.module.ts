import { Module } from '@nestjs/common';
import { EnterpriseCognitionController } from './enterprise-cognition.controller';
import { EnterpriseCognitiveEngineService } from './enterprise-cognitive-engine.service';
import { AutonomousReasoningEngineService } from './autonomous-reasoning-engine.service';
import { MultiAgentDecisionIntelligenceService } from './multi-agent-decision-intelligence.service';
import { EnterpriseKnowledgeSynthesisService } from './enterprise-knowledge-synthesis.service';
import { StrategicPlanningIntelligenceService } from './strategic-planning-intelligence.service';
import { PredictiveOrganizationalIntelligenceService } from './predictive-organizational-intelligence.service';
import { ExecutiveDecisionSupportService } from './executive-decision-support.service';
import { CrossDomainIntelligenceFusionService } from './cross-domain-intelligence-fusion.service';
import { EnterpriseCognitiveOrchestratorService } from './enterprise-cognitive-orchestrator.service';
import { EnterpriseCognitiveDashboardService } from './enterprise-cognitive-dashboard.service';

@Module({
  controllers: [EnterpriseCognitionController],
  providers: [
    EnterpriseCognitiveEngineService,
    AutonomousReasoningEngineService,
    MultiAgentDecisionIntelligenceService,
    EnterpriseKnowledgeSynthesisService,
    StrategicPlanningIntelligenceService,
    PredictiveOrganizationalIntelligenceService,
    ExecutiveDecisionSupportService,
    CrossDomainIntelligenceFusionService,
    EnterpriseCognitiveOrchestratorService,
    EnterpriseCognitiveDashboardService,
  ],
  exports: [
    EnterpriseCognitiveEngineService,
    AutonomousReasoningEngineService,
    MultiAgentDecisionIntelligenceService,
    EnterpriseKnowledgeSynthesisService,
    StrategicPlanningIntelligenceService,
    PredictiveOrganizationalIntelligenceService,
    ExecutiveDecisionSupportService,
    CrossDomainIntelligenceFusionService,
    EnterpriseCognitiveOrchestratorService,
    EnterpriseCognitiveDashboardService,
  ],
})
export class EnterpriseCognitionModule {}