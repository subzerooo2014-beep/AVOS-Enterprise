import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseValueCreationEngineService {
  evaluate(input: {
    revenueScore: number;
    efficiencyScore: number;
    customerValue: number;
    ecosystemValue: number;
  }) {
    const valueScore = Math.round(
      input.revenueScore * 0.3 +
        input.efficiencyScore * 0.25 +
        input.customerValue * 0.25 +
        input.ecosystemValue * 0.2,
    );

    return {
      valueScore,
      action: valueScore >= 80 ? "EXPAND" : valueScore >= 60 ? "OPTIMIZE" : "REBUILD",
    };
  }
}
