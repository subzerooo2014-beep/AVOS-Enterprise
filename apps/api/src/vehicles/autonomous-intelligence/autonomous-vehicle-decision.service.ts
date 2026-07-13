import { Injectable } from "@nestjs/common";

@Injectable()
export class AutonomousVehicleDecisionService {
  decide(input: {
    trustScore: number;
    complianceScore: number;
    profitabilityScore: number;
    fraudRisk: "LOW" | "MEDIUM" | "HIGH";
  }) {
    if (input.fraudRisk === "HIGH") {
      return { decision: "BLOCK", confidence: 99 };
    }

    const score = Math.round(
      input.trustScore * 0.35 +
        input.complianceScore * 0.35 +
        input.profitabilityScore * 0.3,
    );

    return {
      decision: score >= 80 ? "EXECUTE" : score >= 60 ? "REVIEW" : "HOLD",
      confidence: score,
    };
  }
}
