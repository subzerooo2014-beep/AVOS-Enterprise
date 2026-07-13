import { Injectable } from "@nestjs/common";
import {
  VehicleMarketplaceInput,
  VehicleMarketplaceIntelligenceResult,
} from "./vehicle-marketplace-intelligence.types";

@Injectable()
export class VehicleMarketplaceIntelligenceService {
  evaluate(
    input: VehicleMarketplaceInput,
  ): VehicleMarketplaceIntelligenceResult {
    const marketplaceScore = Math.round(
      input.qualityScore * 0.3 +
        input.demandScore * 0.3 +
        input.trustScore * 0.25 +
        input.priceCompetitiveness * 0.15,
    );

    const rankingTier =
      marketplaceScore >= 85
        ? "PREMIUM"
        : marketplaceScore >= 65
          ? "STANDARD"
          : "LIMITED";

    return {
      marketplaceScore,
      rankingTier,
      recommendedBoost:
        rankingTier === "PREMIUM"
          ? 20
          : rankingTier === "STANDARD"
            ? 10
            : 0,
      reasons: [
        `marketplace-score:${marketplaceScore}`,
        `ranking-tier:${rankingTier}`,
      ],
    };
  }
}
