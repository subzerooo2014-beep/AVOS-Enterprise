import { Injectable } from "@nestjs/common";

@Injectable()
export class CapabilityMaturityIndexService {
  calculate(input: {
    processScore: number;
    automationScore: number;
    governanceScore: number;
    intelligenceScore: number;
  }) {
    const maturityScore = Math.round(
      input.processScore * 0.25 +
        input.automationScore * 0.25 +
        input.governanceScore * 0.2 +
        input.intelligenceScore * 0.3,
    );

    return {
      maturityScore,
      level:
        maturityScore >= 85
          ? "OPTIMIZED"
          : maturityScore >= 65
            ? "MANAGED"
            : "DEVELOPING",
    };
  }
}
