import { Injectable } from "@nestjs/common";
import {
  VehicleDecisionGraphInput,
  VehicleDecisionGraphResult,
} from "./vehicle-decision-graph.types";

@Injectable()
export class VehicleDecisionGraphService {
  evaluate(
    input: VehicleDecisionGraphInput,
  ): VehicleDecisionGraphResult {
    const fraudPenalty =
      input.fraudRisk === "HIGH"
        ? 70
        : input.fraudRisk === "MEDIUM"
          ? 25
          : 0;

    const graphScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          input.qualityScore * 0.25 +
            input.marketScore * 0.2 +
            input.buyerMatchScore * 0.25 +
            input.dealerScore * 0.2 +
            10 -
            fraudPenalty,
        ),
      ),
    );

    const decision =
      input.fraudRisk === "HIGH"
        ? "BLOCK"
        : graphScore >= 80
          ? "PUBLISH"
          : graphScore >= 55
            ? "REVIEW"
            : "BLOCK";

    return {
      vehicleId: input.vehicleId,
      graphScore,
      decision,
      nodes: [
        "quality",
        "fraud",
        "market",
        "buyer-match",
        "dealer",
      ],
      reasons: [
        `graph-score:${graphScore}`,
        `decision:${decision}`,
      ],
    };
  }
}
