import { Injectable } from "@nestjs/common";
import {
  VehicleDemandForecastInput,
  VehicleDemandForecastResult,
} from "./vehicle-demand-forecast.types";

@Injectable()
export class VehicleDemandForecastService {
  forecast(input: VehicleDemandForecastInput): VehicleDemandForecastResult {
    const demandScore = Math.max(
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
      demandScore >= 80
        ? "STRONG"
        : demandScore >= 55
          ? "WATCH"
          : "WEAK";

    return {
      vehicleId: input.vehicleId,
      demandScore,
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
