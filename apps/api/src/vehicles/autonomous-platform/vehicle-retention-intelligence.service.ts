import { Injectable } from "@nestjs/common";
import {
  VehicleRetentionIntelligenceInput,
  VehicleRetentionIntelligenceResult,
} from "./vehicle-retention-intelligence.types";

@Injectable()
export class VehicleRetentionIntelligenceService {
  evaluate(input: VehicleRetentionIntelligenceInput): VehicleRetentionIntelligenceResult {
    const retentionScore = Math.max(
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
      retentionScore >= 80
        ? "STRONG"
        : retentionScore >= 55
          ? "WATCH"
          : "WEAK";

    return {
      vehicleId: input.vehicleId,
      retentionScore,
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
