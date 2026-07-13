import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleIntelligenceObservabilityService {
  evaluate(input: {
    availabilityScore: number;
    latencyScore: number;
    errorScore: number;
    traceabilityScore: number;
  }) {
    const observabilityScore = Math.max(
      0,
      Math.round(
        input.availabilityScore * 0.35 +
          input.latencyScore * 0.2 +
          input.traceabilityScore * 0.25 -
          input.errorScore * 0.2,
      ),
    );

    return {
      observabilityScore,
      state:
        observabilityScore >= 85
          ? "EXCELLENT"
          : observabilityScore >= 65
            ? "GOOD"
            : "ATTENTION",
    };
  }
}
