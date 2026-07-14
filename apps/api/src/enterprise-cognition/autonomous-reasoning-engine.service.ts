import { Injectable } from '@nestjs/common';
import { ReasoningHypothesis } from './enterprise-cognition.types';

@Injectable()
export class AutonomousReasoningEngineService {
  reason(hypotheses: ReasoningHypothesis[]) {
    const ranked = [...hypotheses].sort(
      (left, right) => right.confidence - left.confidence,
    );

    const confidence =
      ranked.reduce((sum, item) => sum + item.confidence, 0) /
      Math.max(1, ranked.length);

    return {
      rankedHypotheses: ranked,
      dominantHypothesis: ranked[0] ?? null,
      confidence,
      requiresHumanReview: confidence < 0.65,
    };
  }
}