import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleLogisticsReadinessService {
  evaluate(input: {
    carrierScore: number;
    routeScore: number;
    costScore: number;
    timingScore: number;
  }) {
    const score = Math.round(
      input.carrierScore * 0.3 +
      input.routeScore * 0.25 +
      input.costScore * 0.2 +
      input.timingScore * 0.25,
    );

    return {
      score,
      status: score >= 80 ? "READY" : score >= 60 ? "PARTIAL" : "BLOCKED",
    };
  }
}
