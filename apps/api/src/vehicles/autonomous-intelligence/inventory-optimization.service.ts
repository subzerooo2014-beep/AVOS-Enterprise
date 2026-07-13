import { Injectable } from "@nestjs/common";

@Injectable()
export class InventoryOptimizationService {
  evaluate(input: {
    inventoryAgeDays: number;
    demandScore: number;
    marginScore: number;
    viewsScore: number;
  }) {
    const liquidityScore = Math.round(
      input.demandScore * 0.35 +
        input.marginScore * 0.25 +
        input.viewsScore * 0.2 +
        Math.max(0, 100 - input.inventoryAgeDays) * 0.2,
    );

    return {
      liquidityScore,
      action:
        liquidityScore >= 80
          ? "HOLD"
          : liquidityScore >= 55
            ? "OPTIMIZE"
            : "REPRICE_AND_PROMOTE",
    };
  }
}
