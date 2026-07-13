import { Injectable } from "@nestjs/common";

@Injectable()
export class EventHealthScoreService {
  calculate(input: {
    successRate: number;
    retryRate: number;
    latencyScore: number;
    auditScore: number;
  }) {
    const healthScore = Math.round(
      input.successRate * 0.4 +
      input.latencyScore * 0.25 +
      input.auditScore * 0.25 -
      input.retryRate * 0.1,
    );

    return {
      healthScore,
      status:
        healthScore >= 85
          ? "HEALTHY"
          : healthScore >= 65
            ? "DEGRADED"
            : "CRITICAL",
    };
  }
}
