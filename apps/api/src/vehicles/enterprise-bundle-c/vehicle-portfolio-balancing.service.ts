import { Injectable } from "@nestjs/common";

@Injectable()
export class VehiclePortfolioBalancingService {
  evaluate(input: {
    demandCoverage: number;
    marginCoverage: number;
    categoryDiversity: number;
    inventoryTurnover: number;
  }) {
    const balanceScore = Math.round(
      input.demandCoverage * 0.3 +
      input.marginCoverage * 0.25 +
      input.categoryDiversity * 0.2 +
      input.inventoryTurnover * 0.25,
    );

    return {
      balanceScore,
      state:
        balanceScore >= 80
          ? "BALANCED"
          : balanceScore >= 60
            ? "ADJUST"
            : "REBUILD",
    };
  }
}
