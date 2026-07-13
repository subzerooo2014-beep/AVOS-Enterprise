import { Injectable } from "@nestjs/common";
import {
  VehicleRecommendationInput,
  VehicleRecommendationResult,
} from "./vehicle-recommendation.types";

@Injectable()
export class VehicleRecommendationIntelligenceService {
  evaluate(
    input: VehicleRecommendationInput,
  ): VehicleRecommendationResult {
    const recommendationScore = Math.round(
      input.buyerMatchScore * 0.35 +
        input.vehicleQualityScore * 0.2 +
        input.marketDemandScore * 0.15 +
        input.dealerScore * 0.15 +
        input.priceCompetitiveness * 0.15,
    );

    const rank =
      recommendationScore >= 88
        ? "TOP_PICK"
        : recommendationScore >= 72
          ? "RECOMMENDED"
          : recommendationScore >= 55
            ? "CONSIDER"
            : "HIDDEN";

    return {
      recommendationScore,
      rank,
      reasons: [
        `recommendation-score:${recommendationScore}`,
        `recommendation-rank:${rank}`,
      ],
    };
  }
}
