import { Injectable } from "@nestjs/common";
import {
  VehicleTrustOrchestrationInput,
  VehicleTrustOrchestrationResult,
} from "./vehicle-trust-orchestration.types";

@Injectable()
export class VehicleTrustOrchestrationService {
  evaluate(input: VehicleTrustOrchestrationInput): VehicleTrustOrchestrationResult {
    const trustScore = Math.max(
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
      trustScore >= 80
        ? "STRONG"
        : trustScore >= 55
          ? "WATCH"
          : "WEAK";

    return {
      vehicleId: input.vehicleId,
      trustScore,
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
