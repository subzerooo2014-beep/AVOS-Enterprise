import { Injectable } from "@nestjs/common";
import {
  RecommendationIntelligenceInput,
  RecommendationIntelligenceResult,
} from "./recommendation-intelligence.types";

@Injectable()
export class RecommendationIntelligenceService {
  evaluate(
    input: RecommendationIntelligenceInput,
  ): RecommendationIntelligenceResult {
    const score = Math.round(
      input.buyerMatchScore * 0.4 +
        input.vehicleQualityScore * 0.25 +
        input.marketDemandScore * 0.2 +
        input.dealerScore * 0.15,
    );

    return {
      score,
      rank:
        score >= 88
          ? "TOP_PICK"
          : score >= 72
            ? "RECOMMENDED"
            : score >= 55
              ? "CONSIDER"
              : "HIDDEN",
    };
  }
}
