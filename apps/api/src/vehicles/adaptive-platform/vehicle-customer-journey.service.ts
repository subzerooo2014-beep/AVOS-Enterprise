import { Injectable } from "@nestjs/common";
import {
  VehicleCustomerJourneyInput,
  VehicleCustomerJourneyResult,
} from "./vehicle-customer-journey.types";

@Injectable()
export class VehicleCustomerJourneyService {
  evaluate(input: VehicleCustomerJourneyInput): VehicleCustomerJourneyResult {
    const journeyScore = Math.max(
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
      journeyScore >= 82
        ? "ADVANCED"
        : journeyScore >= 58
          ? "DEVELOPING"
          : "LIMITED";

    return {
      vehicleId: input.vehicleId,
      journeyScore,
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
