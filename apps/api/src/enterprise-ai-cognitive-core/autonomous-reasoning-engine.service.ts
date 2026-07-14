import { Injectable } from '@nestjs/common';
import { CognitiveHypothesis } from './enterprise-ai-cognitive-core.types';

@Injectable()
export class AutonomousReasoningEngineService {
  reason(hypotheses: CognitiveHypothesis[]) {
    const ranked = [...hypotheses].sort(
      (left, right) =>
        right.confidence - left.confidence ||
        right.score - left.score,
    );

    const confidence =
      ranked.reduce(
        (sum, hypothesis) => sum + hypothesis.confidence,
        0,
      ) / Math.max(1, ranked.length);

    return {
      rankedHypotheses: ranked,
      dominantHypothesis: ranked[0] ?? null,
      confidence,
      unresolvedContradictions: ranked.flatMap(
        (hypothesis) => hypothesis.contradictions,
      ),
      requiresHumanReview:
        confidence < 0.65 ||
        ranked.some(
          (hypothesis) => hypothesis.contradictions.length > 2,
        ),
    };
  }
}