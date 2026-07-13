import { Injectable } from "@nestjs/common";
import {
  VehicleEvolutionInput,
  VehicleEvolutionResult,
} from "./vehicle-evolution.types";

@Injectable()
export class VehicleEvolutionPlannerService {
  plan(
    input: VehicleEvolutionInput,
  ): VehicleEvolutionResult {
    const evolutionScore = Math.round(
      input.currentQualityScore * 0.35 +
        input.currentMarketScore * 0.35 +
        input.currentConversionRate * 0.3,
    );

    const recommendations: string[] = [];

    if (input.currentQualityScore < 70) {
      recommendations.push("improve-listing-quality");
    }

    if (input.currentMarketScore < 70) {
      recommendations.push("optimize-market-ranking");
    }

    if (input.currentConversionRate < 50) {
      recommendations.push("improve-buyer-conversion");
    }

    return {
      evolutionScore,
      recommendations,
      nextStage:
        evolutionScore >= 85
          ? "SCALE"
          : evolutionScore >= 60
            ? "OPTIMIZE"
            : "REBUILD",
    };
  }
}
