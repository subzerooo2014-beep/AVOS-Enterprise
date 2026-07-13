import { Injectable } from "@nestjs/common";
import {
  VehiclePriceOptimizationInput,
  VehiclePriceOptimizationResult,
} from "./vehicle-price-optimization.types";

@Injectable()
export class VehiclePriceOptimizationService {
  optimize(input: VehiclePriceOptimizationInput): VehiclePriceOptimizationResult {
    const optimizedPrice = Math.max(
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
      optimizedPrice >= 80
        ? "STRONG"
        : optimizedPrice >= 55
          ? "WATCH"
          : "WEAK";

    return {
      vehicleId: input.vehicleId,
      optimizedPrice,
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
