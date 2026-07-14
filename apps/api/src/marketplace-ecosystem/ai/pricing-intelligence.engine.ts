import { Injectable } from "@nestjs/common";
@Injectable()
export class PricingIntelligenceEngine {
  analyze(input: { currentPrice: number; marketPrices: number[] }) {
    const average = input.marketPrices.length
      ? input.marketPrices.reduce((a,b) => a+b,0) / input.marketPrices.length
      : input.currentPrice;
    const deviation = average
      ? Math.round(((input.currentPrice - average) / average) * 100)
      : 0;
    return {
      averagePrice: Math.round(average * 100) / 100,
      deviationPercent: deviation,
      recommendation:
        deviation > 10 ? "REDUCE_PRICE" :
        deviation < -10 ? "INCREASE_PRICE" :
        "KEEP_PRICE",
    };
  }
}
