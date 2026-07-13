import { Injectable } from "@nestjs/common";
import {
  VehicleValueCreationInput,
  VehicleValueCreationResult,
} from "./vehicle-value-creation.types";

@Injectable()
export class VehicleValueCreationService {
  evaluate(input: VehicleValueCreationInput): VehicleValueCreationResult {
    const valueScore = Math.max(
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
      valueScore >= 82
        ? "ADVANCED"
        : valueScore >= 58
          ? "DEVELOPING"
          : "LIMITED";

    return {
      vehicleId: input.vehicleId,
      valueScore,
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
