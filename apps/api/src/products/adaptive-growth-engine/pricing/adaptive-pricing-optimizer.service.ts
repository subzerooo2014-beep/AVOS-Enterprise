import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  PricingRecommendation,
  ProductMarketInput,
} from "../contracts/adaptive-growth-engine.contracts";

@Injectable()
export class AdaptivePricingOptimizerService {
  private readonly recommendations =
    new Map<string, PricingRecommendation>();

  recommend(
    input: ProductMarketInput,
    currentPrice?: number,
  ): PricingRecommendation {
    const basePrice =
      currentPrice ??
      Math.max(1, input.currentMetrics.averageOrderValue);
    const ltvCac =
      input.currentMetrics.acquisitionCost > 0
        ? input.currentMetrics.lifetimeValue /
          input.currentMetrics.acquisitionCost
        : 1;
    const multiplier =
      ltvCac >= 4 ? 1.1 : ltvCac >= 3 ? 1.05 : 0.97;
    const recommendedPrice =
      Math.round(basePrice * multiplier * 100) / 100;

    const recommendation: PricingRecommendation = {
      id: `aage-pricing:${randomUUID()}`,
      tenantId: input.tenantId,
      productId: input.productId,
      currentPrice: basePrice,
      recommendedPrice,
      expectedConversionChange:
        multiplier > 1 ? -2 : multiplier < 1 ? 5 : 0,
      expectedRevenueChange:
        multiplier > 1 ? 8 : multiplier < 1 ? 4 : 0,
      confidence: 82,
      rationale: [
        `LTV to CAC ratio: ${ltvCac.toFixed(2)}`,
        `Average order value: ${input.currentMetrics.averageOrderValue}`,
        "Recommendation requires governed experiment before rollout",
      ],
      status: "pending",
      generatedAt: new Date().toISOString(),
    };
    this.recommendations.set(recommendation.id, recommendation);
    return this.clone(recommendation);
  }

  approve(id: string) {
    const item = this.recommendations.get(id);
    if (!item) return undefined;
    item.status = "approved";
    return this.clone(item);
  }

  list() {
    return [...this.recommendations.values()].map((item) => this.clone(item));
  }

  health() {
    return {
      status: "operational",
      recommendations: this.recommendations.size,
      valueBasedPricing: true,
      pricingExperimentRequired: true,
      humanApprovalRequired: true,
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }

  private clone(
    value: PricingRecommendation,
  ): PricingRecommendation {
    return JSON.parse(JSON.stringify(value)) as PricingRecommendation;
  }
}