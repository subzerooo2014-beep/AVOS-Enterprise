import { Injectable } from "@nestjs/common";
import { clamp, round } from "../ultra-ai-commerce.utils";

@Injectable()
export class DynamicPricingEngine {
  calculate(input: { askingPrice: number; marketAveragePrice?: number; conditionScore: number; mileage: number; year: number }) {
    const market = input.marketAveragePrice ?? input.askingPrice;
    const agePenalty = Math.max(0, new Date().getFullYear() - input.year) * 0.008;
    const mileagePenalty = Math.min(0.25, input.mileage / 500000);
    const conditionFactor = 0.7 + clamp(input.conditionScore) / 333;
    const recommended = market * conditionFactor * (1 - agePenalty - mileagePenalty);
    return {
      recommendedPrice: round(Math.max(recommended, market * 0.55)),
      minPrice: round(recommended * 0.94),
      maxPrice: round(recommended * 1.06),
      confidence: clamp(70 + input.conditionScore * 0.2),
    };
  }
}
