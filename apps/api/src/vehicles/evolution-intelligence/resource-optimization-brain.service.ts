import { Injectable } from "@nestjs/common";

@Injectable()
export class ResourceOptimizationBrainService {
  optimize(input: {
    capacityScore: number;
    demandScore: number;
    costScore: number;
    performanceScore: number;
  }) {
    const optimizationScore = Math.round(
      input.capacityScore * 0.25 +
        input.demandScore * 0.25 +
        input.costScore * 0.2 +
        input.performanceScore * 0.3,
    );

    return {
      optimizationScore,
      strategy: optimizationScore >= 80 ? "SCALE" : optimizationScore >= 60 ? "BALANCE" : "REDUCE",
    };
  }
}
