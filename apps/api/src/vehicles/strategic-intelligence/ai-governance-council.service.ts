import { Injectable } from "@nestjs/common";

@Injectable()
export class AiGovernanceCouncilService {
  review(input: {
    ethicsScore: number;
    safetyScore: number;
    explainabilityScore: number;
    accountabilityScore: number;
  }) {
    const governanceScore = Math.round(
      input.ethicsScore * 0.25 +
        input.safetyScore * 0.3 +
        input.explainabilityScore * 0.2 +
        input.accountabilityScore * 0.25,
    );

    return {
      governanceScore,
      decision:
        governanceScore >= 85
          ? "APPROVE"
          : governanceScore >= 65
            ? "CONDITIONAL"
            : "REJECT",
    };
  }
}
