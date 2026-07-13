import { Injectable } from "@nestjs/common";

@Injectable()
export class AiStrategicPlannerService {
  plan(input: {
    growthScore: number;
    marketScore: number;
    executionScore: number;
    riskScore: number;
  }) {
    const strategyScore = Math.round(
      input.growthScore * 0.3 +
        input.marketScore * 0.3 +
        input.executionScore * 0.25 -
        input.riskScore * 0.15,
    );

    return {
      strategyScore,
      action:
        strategyScore >= 80
          ? "EXPAND"
          : strategyScore >= 60
            ? "OPTIMIZE"
            : "DEFEND",
    };
  }
}
