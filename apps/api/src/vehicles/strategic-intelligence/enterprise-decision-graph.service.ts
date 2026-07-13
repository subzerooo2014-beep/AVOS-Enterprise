import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseDecisionGraphService {
  evaluate(input: {
    trustScore: number;
    complianceScore: number;
    profitabilityScore: number;
    strategicFit: number;
  }) {
    const score = Math.round(
      input.trustScore * 0.25 +
        input.complianceScore * 0.25 +
        input.profitabilityScore * 0.25 +
        input.strategicFit * 0.25,
    );

    return {
      score,
      decision:
        score >= 85
          ? "APPROVE"
          : score >= 65
            ? "REVIEW"
            : "REJECT",
    };
  }
}
