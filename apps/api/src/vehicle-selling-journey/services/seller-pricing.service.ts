import { Injectable } from "@nestjs/common";
@Injectable()
export class SellerPricingService {
  calculate(input: {
    askingPrice: number;
    marketAveragePrice: number;
    conditionScore: number;
    mileage: number;
    year: number;
  }) {
    const age = Math.max(0, new Date().getFullYear() - input.year);
    const adjustment =
      input.conditionScore / 100 -
      age * 0.01 -
      Math.min(0.2, input.mileage / 500000);
    const recommended =
      input.marketAveragePrice * (0.8 + adjustment * 0.25);
    return {
      recommendedPrice: Math.round(recommended),
      minPrice: Math.round(recommended * 0.95),
      maxPrice: Math.round(recommended * 1.05),
    };
  }
}
