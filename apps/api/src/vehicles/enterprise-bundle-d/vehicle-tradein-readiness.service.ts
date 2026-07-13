import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleTradeInReadinessService {
  evaluate(input: {
    conditionScore: number;
    demandScore: number;
    depreciationScore: number;
    liquidityScore: number;
  }) {
    const score = Math.round(
      input.conditionScore * 0.3 +
      input.demandScore * 0.25 +
      input.depreciationScore * 0.2 +
      input.liquidityScore * 0.25,
    );

    return {
      score,
      accepted: score >= 65,
    };
  }
}
