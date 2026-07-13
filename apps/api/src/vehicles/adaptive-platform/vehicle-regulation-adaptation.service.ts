import { Injectable } from "@nestjs/common";
import {
  VehicleRegulationAdaptationInput,
  VehicleRegulationAdaptationResult,
} from "./vehicle-regulation-adaptation.types";

@Injectable()
export class VehicleRegulationAdaptationService {
  evaluate(input: VehicleRegulationAdaptationInput): VehicleRegulationAdaptationResult {
    const adaptationScore = Math.max(
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
      adaptationScore >= 82
        ? "ADVANCED"
        : adaptationScore >= 58
          ? "DEVELOPING"
          : "LIMITED";

    return {
      vehicleId: input.vehicleId,
      adaptationScore,
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
