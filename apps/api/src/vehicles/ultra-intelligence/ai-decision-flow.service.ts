import { Injectable } from "@nestjs/common";

@Injectable()
export class AiDecisionFlowService {
  decide(input: {
    approvalScore: number;
    marketplaceScore: number;
    trustScore: number;
    fraudRisk: "LOW" | "MEDIUM" | "HIGH";
  }) {
    if (input.fraudRisk === "HIGH") {
      return {
        decision: "BLOCK",
        confidence: 99,
      };
    }

    const score = Math.round(
      input.approvalScore * 0.4 +
        input.marketplaceScore * 0.35 +
        input.trustScore * 0.25,
    );

    return {
      decision:
        score >= 85
          ? "PUBLISH"
          : score >= 60
            ? "REVIEW"
            : "REJECT",
      confidence: score,
    };
  }
}
