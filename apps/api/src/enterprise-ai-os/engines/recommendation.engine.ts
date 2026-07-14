import { Injectable } from "@nestjs/common";
@Injectable()
export class EnterpriseRecommendationEngine {
  rank(candidates: Array<{ id: string; relevance: number; trust: number; value: number }>) {
    return candidates
      .map((candidate) => ({
        ...candidate,
        score: Math.round(
          candidate.relevance * 0.45 +
          candidate.trust * 0.35 +
          candidate.value * 0.2,
        ),
      }))
      .sort((a, b) => b.score - a.score);
  }
}
