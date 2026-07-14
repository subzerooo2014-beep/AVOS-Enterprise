import { Injectable } from '@nestjs/common';
import {
  CognitiveSignal,
  KnowledgeFragment,
} from './enterprise-ai-cognitive-core.types';
import { EnterpriseCognitiveEngineService } from './enterprise-cognitive-engine.service';
import { AutonomousReasoningEngineService } from './autonomous-reasoning-engine.service';
import { KnowledgeSynthesisEngineService } from './knowledge-synthesis-engine.service';
import { StrategicPlanningIntelligenceService } from './strategic-planning-intelligence.service';
import { DecisionExplainabilityEngineService } from './decision-explainability-engine.service';

@Injectable()
export class CognitiveWorkflowOrchestratorService {
  constructor(
    private readonly cognition: EnterpriseCognitiveEngineService,
    private readonly reasoning: AutonomousReasoningEngineService,
    private readonly synthesis: KnowledgeSynthesisEngineService,
    private readonly planning: StrategicPlanningIntelligenceService,
    private readonly explainability: DecisionExplainabilityEngineService,
  ) {}

  run(
    objective: string,
    signals: CognitiveSignal[],
    horizonDays = 90,
  ) {
    const hypotheses = this.cognition.generateHypotheses(signals);
    const reasoning = this.reasoning.reason(hypotheses);
    const fragments: KnowledgeFragment[] = signals.map((signal) => ({
      id: `fragment-${signal.id}`,
      domain: signal.domain,
      concept: signal.source,
      content: `${signal.domain}:${signal.value}`,
      confidence: signal.confidence,
      source: signal.source,
    }));
    const knowledge = this.synthesis.synthesize(
      fragments,
      hypotheses,
    );
    const plan = this.planning.plan(
      objective,
      knowledge.synthesizedInsights.map(
        (insight) => insight.insight,
      ),
      horizonDays,
    );
    const decision =
      reasoning.dominantHypothesis?.statement ??
      `Proceed with ${objective}`;
    const explanation = this.explainability.explain(
      decision,
      hypotheses,
      reasoning.confidence,
    );

    return {
      objective,
      hypotheses,
      reasoning,
      knowledge,
      plan,
      explanation,
    };
  }
}