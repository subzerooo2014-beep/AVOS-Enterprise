import { Injectable } from "@nestjs/common";
import { round } from "../ultra-ai-commerce.utils";

@Injectable()
export class MarketIntelligenceEngine {
  analyze(input: { observedPrices: number[]; demandSignals?: number[] }) {
    const prices = input.observedPrices.length ? input.observedPrices : [0];
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const demand = input.demandSignals?.length
      ? input.demandSignals.reduce((a, b) => a + b, 0) / input.demandSignals.length
      : 50;
    return { averagePrice: round(averagePrice), minPrice, maxPrice, demandScore: round(demand), trend: demand >= 60 ? "UP" : demand <= 40 ? "DOWN" : "STABLE" };
  }
}
