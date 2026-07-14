import { Injectable } from "@nestjs/common";

@Injectable()
export class AdaptivePricingIntelligenceService {
  calculate(basePrice = 100000, demandScore = 88, supplyScore = 76) {
    const adjustment = Math.round((demandScore - supplyScore) * 0.0025 * basePrice);
    const optimizedPrice = basePrice + adjustment;

    return {
      basePrice,
      optimizedPrice,
      adjustment,
      pricingConfidence: 93,
      calculatedAt: new Date().toISOString(),
    };
  }
}