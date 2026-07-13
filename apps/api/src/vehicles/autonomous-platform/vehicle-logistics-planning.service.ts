import { Injectable } from "@nestjs/common";
import {
  VehicleLogisticsPlanningInput,
  VehicleLogisticsPlanningResult,
} from "./vehicle-logistics-planning.types";

@Injectable()
export class VehicleLogisticsPlanningService {
  plan(input: VehicleLogisticsPlanningInput): VehicleLogisticsPlanningResult {
    const logisticsScore = Math.max(
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
      logisticsScore >= 80
        ? "STRONG"
        : logisticsScore >= 55
          ? "WATCH"
          : "WEAK";

    return {
      vehicleId: input.vehicleId,
      logisticsScore,
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
