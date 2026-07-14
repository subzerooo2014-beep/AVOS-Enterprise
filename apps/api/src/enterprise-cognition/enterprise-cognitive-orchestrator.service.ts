import { Injectable } from '@nestjs/common';
import { EnterpriseCognitiveEngineService } from './enterprise-cognitive-engine.service';
import { AutonomousReasoningEngineService } from './autonomous-reasoning-engine.service';
import { EnterpriseKnowledgeSynthesisService } from './enterprise-knowledge-synthesis.service';
import { StrategicPlanningIntelligenceService } from './strategic-planning-intelligence.service';
import { PredictiveOrganizationalIntelligenceService } from './predictive-organizational-intelligence.service';
import { CrossDomainIntelligenceFusionService } from './cross-domain-intelligence-fusion.service';
import { ExecutiveDecisionSupportService } from './executive-decision-support.service';
import { CognitionSignal } from './enterprise-cognition.types';

@Injectable()
export class EnterpriseCognitiveOrchestratorService {
  constructor(
    private readonly cognition: EnterpriseCognitiveEngineService,
    private readonly reasoning: AutonomousReasoningEngineService,
    private readonly knowledge: EnterpriseKnowledgeSynthesisService,
    private readonly planning: StrategicPlanningIntelligenceService,
    private readonly prediction: PredictiveOrganizationalIntelligenceService,
    private readonly fusion: CrossDomainIntelligenceFusionService,
    private readonly executive: ExecutiveDecisionSupportService,
  ) {}

  run(objective: string, signals: CognitionSignal[], horizonDays = 90) {
    const hypotheses = this.cognition.createHypotheses(signals);
    const reasoning = this.reasoning.reason(hypotheses);
    const knowledge = this.knowledge.synthesize(signals, hypotheses);
    const prediction = this.prediction.predict(signals);
    const fusion = this.fusion.fuse(signals);
    const plan = this.planning.createPlan(
      objective,
      knowledge.synthesizedInsights.map((insight) => insight.statement),
      horizonDays,
    );
    const brief = this.executive.createBrief(
      objective,
      plan.actions,
      reasoning.confidence,
      hypotheses.map((hypothesis) => hypothesis.statement),
    );

    return {
      objective,
      hypotheses,
      reasoning,
      knowledge,
      prediction,
      fusion,
      plan,
      executiveBrief: brief,
    };
  }
}