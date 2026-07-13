import { Injectable } from "@nestjs/common";
import {
  VehiclePlatformEvolutionInput,
  VehiclePlatformEvolutionResult,
} from "./vehicle-platform-evolution.types";

@Injectable()
export class VehiclePlatformEvolutionService {
  evaluate(input: VehiclePlatformEvolutionInput): VehiclePlatformEvolutionResult {
    const evolutionScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          input.primaryScore * 0.35 +
            input.secondaryScore * 0.25 +
            input.readinessScore * 0.3 -
            input.riskScore * 0.1,
        ),
      ),
    );

    const status =
      evolutionScore >= 82
        ? "ADVANCED"
        : evolutionScore >= 58
          ? "DEVELOPING"
          : "LIMITED";

    return {
      vehicleId: input.vehicleId,
      evolutionScore,
      status,
      actions:
        status === "ADVANCED"
          ? ["scale-capability", "activate-autonomy"]
          : status === "DEVELOPING"
            ? ["optimize-capability", "collect-more-data"]
            : ["manual-review", "rebuild-capability"],
    };
  }
}
