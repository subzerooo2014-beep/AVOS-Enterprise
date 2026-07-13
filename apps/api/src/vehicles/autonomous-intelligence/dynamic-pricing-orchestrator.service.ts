import { Injectable } from "@nestjs/common";

@Injectable()
export class DynamicPricingOrchestratorService {
  calculate(input: {
    basePrice: number;
    demandScore: number;
    competitionScore: number;
    inventoryAgeDays: number;
  }) {
    const demandMultiplier = 1 + (input.demandScore - 50) / 500;
    const competitionMultiplier = 1 - (input.competitionScore - 50) / 700;
    const ageDiscount = Math.min(input.inventoryAgeDays * 0.0015, 0.15);

    const recommendedPrice = Math.round(
      input.basePrice *
        demandMultiplier *
        competitionMultiplier *
        (1 - ageDiscount),
    );

    return {
      recommendedPrice,
      minimumPrice: Math.round(recommendedPrice * 0.94),
      maximumPrice: Math.round(recommendedPrice * 1.06),
    };
  }
}
