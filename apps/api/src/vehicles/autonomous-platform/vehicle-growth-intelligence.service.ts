import { Injectable } from "@nestjs/common";
import {
  VehicleGrowthIntelligenceInput,
  VehicleGrowthIntelligenceResult,
} from "./vehicle-growth-intelligence.types";

@Injectable()
export class VehicleGrowthIntelligenceService {
  evaluate(input: VehicleGrowthIntelligenceInput): VehicleGrowthIntelligenceResult {
    const growthScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          input.primaryScore * 0.5 +
            input.secondaryScore * 0.35 -
            input.riskScore * 0.15,
        ),
      ),
    );

    const status =
      growthScore >= 80
        ? "STRONG"
        : growthScore >= 55
          ? "WATCH"
          : "WEAK";

    return {
      vehicleId: input.vehicleId,
      growthScore,
      status,
      recommendations:
        status === "STRONG"
          ? ["scale-capability"]
          : status === "WATCH"
            ? ["optimize-capability"]
            : ["manual-intervention"],
    };
  }
}
