import { Injectable } from "@nestjs/common";
import {
  VehicleExportReadinessInput,
  VehicleExportReadinessResult,
} from "./vehicle-export-readiness.types";

@Injectable()
export class VehicleExportReadinessService {
  evaluate(input: VehicleExportReadinessInput): VehicleExportReadinessResult {
    const exportScore = Math.max(
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
      exportScore >= 80
        ? "STRONG"
        : exportScore >= 55
          ? "WATCH"
          : "WEAK";

    return {
      vehicleId: input.vehicleId,
      exportScore,
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
