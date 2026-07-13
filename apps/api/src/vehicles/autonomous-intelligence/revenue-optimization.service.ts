import { Injectable } from "@nestjs/common";

@Injectable()
export class RevenueOptimizationService {
  evaluate(input: {
    conversionScore: number;
    marginScore: number;
    demandScore: number;
    retentionScore: number;
  }) {
    const revenueScore = Math.round(
      input.conversionScore * 0.3 +
        input.marginScore * 0.3 +
        input.demandScore * 0.2 +
        input.retentionScore * 0.2,
    );

    return {
      revenueScore,
      strategy:
        revenueScore >= 80
          ? "SCALE"
          : revenueScore >= 55
            ? "OPTIMIZE"
            : "RECOVER",
    };
  }
}
