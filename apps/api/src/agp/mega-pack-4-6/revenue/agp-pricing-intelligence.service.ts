import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PricingScenario } from "../contracts/agp-revenue.contracts";

@Injectable()
export class AgpPricingIntelligenceService {
  private readonly scenarios: PricingScenario[] = [];

  evaluate(input: {
    productId: string;
    currentPrice: number;
    proposedPrice: number;
    currency: string;
    baselineDemand: number;
    elasticity?: number;
  }): PricingScenario {
    const elasticity = input.elasticity ?? -1.2;
    const priceChange =
      input.currentPrice > 0
        ? (input.proposedPrice - input.currentPrice) / input.currentPrice
        : 0;
    const estimatedDemandChange = elasticity * priceChange;
    const currentRevenue = input.currentPrice * input.baselineDemand;
    const proposedDemand = Math.max(
      0,
      input.baselineDemand * (1 + estimatedDemandChange),
    );
    const proposedRevenue = input.proposedPrice * proposedDemand;
    const estimatedRevenueChange =
      currentRevenue > 0
        ? (proposedRevenue - currentRevenue) / currentRevenue
        : 0;

    const scenario: PricingScenario = {
      id: `agp-pricing:${randomUUID()}`,
      productId: input.productId,
      currentPrice: input.currentPrice,
      proposedPrice: input.proposedPrice,
      currency: input.currency,
      estimatedDemandChange: Number(estimatedDemandChange.toFixed(4)),
      estimatedRevenueChange: Number(estimatedRevenueChange.toFixed(4)),
      elasticity,
      confidence: input.baselineDemand > 0 ? 0.75 : 0.5,
      risk: Math.abs(priceChange) > 0.25 ? "high" : Math.abs(priceChange) > 0.1 ? "medium" : "low",
      requiresHumanApproval: true,
      generatedAt: new Date().toISOString(),
    };

    this.scenarios.push(scenario);
    return { ...scenario };
  }

  list(): PricingScenario[] {
    return this.scenarios.map((scenario) => ({ ...scenario }));
  }
}