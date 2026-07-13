import { Injectable } from "@nestjs/common";
import {
  VehicleScenarioSimulationInput,
  VehicleScenarioSimulationResult,
} from "./vehicle-scenario-simulation.types";

@Injectable()
export class VehicleScenarioSimulationService {
  simulate(input: VehicleScenarioSimulationInput): VehicleScenarioSimulationResult {
    const scenarioScore = Math.max(
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
      scenarioScore >= 82
        ? "ADVANCED"
        : scenarioScore >= 58
          ? "DEVELOPING"
          : "LIMITED";

    return {
      vehicleId: input.vehicleId,
      scenarioScore,
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
