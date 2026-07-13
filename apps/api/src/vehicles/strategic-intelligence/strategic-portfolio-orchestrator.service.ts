import { Injectable } from "@nestjs/common";

@Injectable()
export class StrategicPortfolioOrchestratorService {
  orchestrate(input: {
    valueScore: number;
    readinessScore: number;
    riskScore: number;
    strategicFit: number;
  }) {
    const portfolioScore = Math.round(
      input.valueScore * 0.3 +
        input.readinessScore * 0.25 +
        input.strategicFit * 0.3 -
        input.riskScore * 0.15,
    );

    return {
      portfolioScore,
      priority:
        portfolioScore >= 80
          ? "HIGH"
          : portfolioScore >= 60
            ? "MEDIUM"
            : "LOW",
    };
  }
}
