import { Injectable } from "@nestjs/common";
import {
  VehicleContextMemoryInput,
  VehicleContextMemoryResult,
} from "./vehicle-context-memory.types";

@Injectable()
export class VehicleContextMemoryService {
  evaluate(input: VehicleContextMemoryInput): VehicleContextMemoryResult {
    const contextScore = Math.max(
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
      contextScore >= 82
        ? "ADVANCED"
        : contextScore >= 58
          ? "DEVELOPING"
          : "LIMITED";

    return {
      vehicleId: input.vehicleId,
      contextScore,
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
