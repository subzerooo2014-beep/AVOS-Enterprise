import { Injectable } from "@nestjs/common";

@Injectable()
export class EventRoutingIntelligenceService {
  route(input: {
    priority: number;
    riskScore: number;
    workloadScore: number;
  }) {
    const score = Math.round(
      input.priority * 0.4 +
      input.riskScore * 0.35 +
      input.workloadScore * 0.25,
    );

    return {
      queue:
        score >= 80
          ? "critical"
          : score >= 55
            ? "priority"
            : "standard",
      score,
    };
  }
}
