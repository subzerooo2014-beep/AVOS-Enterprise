import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseIntegrationHealthService {
  evaluate(input: {
    availability: number;
    latencyScore: number;
    errorRate: number;
    dependencyScore: number;
  }) {
    const healthScore = Math.max(
      0,
      Math.round(
        input.availability * 0.35 +
        input.latencyScore * 0.25 +
        input.dependencyScore * 0.25 -
        input.errorRate * 0.15,
      ),
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
