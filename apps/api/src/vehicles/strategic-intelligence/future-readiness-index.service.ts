import { Injectable } from "@nestjs/common";

@Injectable()
export class FutureReadinessIndexService {
  calculate(input: {
    innovationScore: number;
    talentScore: number;
    technologyScore: number;
    resilienceScore: number;
  }) {
    const readinessScore = Math.round(
      input.innovationScore * 0.3 +
        input.talentScore * 0.2 +
        input.technologyScore * 0.3 +
        input.resilienceScore * 0.2,
    );

    return {
      readinessScore,
      state:
        readinessScore >= 85
          ? "FUTURE_READY"
          : readinessScore >= 65
            ? "TRANSITIONING"
            : "AT_RISK",
    };
  }
}
