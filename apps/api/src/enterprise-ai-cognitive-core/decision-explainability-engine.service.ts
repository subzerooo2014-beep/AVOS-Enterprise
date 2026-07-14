import { Injectable } from '@nestjs/common';
import {
  CognitiveHypothesis,
  ExplainableDecision,
} from './enterprise-ai-cognitive-core.types';

@Injectable()
export class DecisionExplainabilityEngineService {
  explain(
    decision: string,
    hypotheses: CognitiveHypothesis[],
    confidence: number,
  ): ExplainableDecision {
    return {
      decision,
      confidence,
      evidence: hypotheses.flatMap(
        (hypothesis) => hypothesis.evidence,
      ),
      counterEvidence: hypotheses.flatMap(
        (hypothesis) => hypothesis.contradictions,
      ),
      reasoningSteps: hypotheses.map(
        (hypothesis, index) =>
          `${index + 1}. Evaluated ${hypothesis.statement} at ${Math.round(
            hypothesis.confidence * 100,
          )}% confidence`,
      ),
      limitations: [
        'signal freshness may vary',
        'external context may be incomplete',
        'human approval remains required for high-impact actions',
      ],
    };
  }
}