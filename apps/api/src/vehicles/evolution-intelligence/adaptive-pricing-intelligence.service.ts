import { Injectable } from "@nestjs/common";

@Injectable()
export class AdaptivePricingIntelligenceService {
  calculate(input: {
    basePrice: number;
    demandScore: number;
    supplyScore: number;
    trustScore: number;
  }) {
    const multiplier =
      1 +
      (input.demandScore - input.supplyScore) / 1000 +
      (input.trustScore - 50) / 2000;

    const price = Math.max(0, Math.round(input.basePrice * multiplier));

    return {
      price,
      multiplier: Number(multiplier.toFixed(4)),
    };
  }
}
