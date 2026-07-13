import { Injectable } from "@nestjs/common";

@Injectable()
export class DynamicMarketplaceComposerService {
  compose(input: {
    supplyScore: number;
    demandScore: number;
    liquidityScore: number;
    trustScore: number;
  }) {
    const marketplaceScore = Math.round(
      input.supplyScore * 0.25 +
        input.demandScore * 0.3 +
        input.liquidityScore * 0.25 +
        input.trustScore * 0.2,
    );

    return {
      marketplaceScore,
      configuration: marketplaceScore >= 80 ? "EXPANSION" : marketplaceScore >= 60 ? "BALANCED" : "RECOVERY",
    };
  }
}
