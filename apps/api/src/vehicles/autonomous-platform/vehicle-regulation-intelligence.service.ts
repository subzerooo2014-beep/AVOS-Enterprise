import { Injectable } from "@nestjs/common";
import {
  VehicleRegulationIntelligenceInput,
  VehicleRegulationIntelligenceResult,
} from "./vehicle-regulation-intelligence.types";

@Injectable()
export class VehicleRegulationIntelligenceService {
  evaluate(input: VehicleRegulationIntelligenceInput): VehicleRegulationIntelligenceResult {
    const complianceScore = Math.max(
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
      complianceScore >= 80
        ? "STRONG"
        : complianceScore >= 55
          ? "WATCH"
          : "WEAK";

    return {
      vehicleId: input.vehicleId,
      complianceScore,
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
