import { Injectable } from "@nestjs/common";
import {
  VehicleServiceOrchestrationInput,
  VehicleServiceOrchestrationResult,
} from "./vehicle-service-orchestration.types";

@Injectable()
export class VehicleServiceOrchestrationService {
  orchestrate(input: VehicleServiceOrchestrationInput): VehicleServiceOrchestrationResult {
    const serviceScore = Math.max(
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
      serviceScore >= 82
        ? "ADVANCED"
        : serviceScore >= 58
          ? "DEVELOPING"
          : "LIMITED";

    return {
      vehicleId: input.vehicleId,
      serviceScore,
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
