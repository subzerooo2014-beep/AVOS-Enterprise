import { Injectable } from "@nestjs/common";
import {
  VehicleCapabilityFusionInput,
  VehicleCapabilityFusionResult,
} from "./vehicle-capability-fusion.types";

@Injectable()
export class VehicleCapabilityFusionService {
  fuse(input: VehicleCapabilityFusionInput): VehicleCapabilityFusionResult {
    const fusionScore = Math.max(
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
      fusionScore >= 82
        ? "ADVANCED"
        : fusionScore >= 58
          ? "DEVELOPING"
          : "LIMITED";

    return {
      vehicleId: input.vehicleId,
      fusionScore,
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
