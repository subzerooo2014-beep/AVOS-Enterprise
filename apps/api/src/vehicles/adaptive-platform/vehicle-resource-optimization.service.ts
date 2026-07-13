import { Injectable } from "@nestjs/common";
import {
  VehicleResourceOptimizationInput,
  VehicleResourceOptimizationResult,
} from "./vehicle-resource-optimization.types";

@Injectable()
export class VehicleResourceOptimizationService {
  optimize(input: VehicleResourceOptimizationInput): VehicleResourceOptimizationResult {
    const resourceScore = Math.max(
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
      resourceScore >= 82
        ? "ADVANCED"
        : resourceScore >= 58
          ? "DEVELOPING"
          : "LIMITED";

    return {
      vehicleId: input.vehicleId,
      resourceScore,
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
