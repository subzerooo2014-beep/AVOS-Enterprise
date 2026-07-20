import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GrowthOpportunity,
  GrowthRecommendation,
  PricingRecommendation,
  ProductMarketAnalysis,
  RevenueForecast,
} from "../contracts/adaptive-growth-engine.contracts";

@Injectable()
export class IntelligentGrowthRecommendationService {
  private readonly recommendations =
    new Map<string, GrowthRecommendation>();

  generate(input: {
    analysis: ProductMarketAnalysis;
    opportunities: GrowthOpportunity[];
    pricing: PricingRecommendation;
    forecast: RevenueForecast;
  }): GrowthRecommendation[] {
    const items = [
      ...input.opportunities.slice(0, 4).map((opportunity) => ({
        category: opportunity.category,
        title: opportunity.title,
        action: opportunity.description,
        expectedImpact: opportunity.expectedImpact,
        urgency: opportunity.priorityScore,
        confidence: opportunity.confidence,
        explainability: opportunity.rationale,
      })),
      {
        category: "pricing",
        title: "Run governed pricing experiment",
        action: `Test price ${input.pricing.recommendedPrice} against current price ${input.pricing.currentPrice}.`,
        expectedImpact: 80,
        urgency: 75,
        confidence: input.pricing.confidence,
        explainability: input.pricing.rationale,
      },
      {
        category: "forecast",
        title: "Align investment with expected scenario",
        action: `Use the expected ${input.forecast.horizonMonths}-month revenue scenario as the primary operating case.`,
        expectedImpact: 70,
        urgency: 65,
        confidence: input.forecast.confidence,
        explainability: input.forecast.assumptions,
      },
    ];

    return items
      .map((item) => {
        const priorityScore = Math.round(
          item.expectedImpact * 0.4 +
            item.urgency * 0.3 +
            item.confidence * 0.3,
        );
        const recommendation: GrowthRecommendation = {
          id: `aage-recommendation:${randomUUID()}`,
          tenantId: input.analysis.tenantId,
          productId: input.analysis.productId,
          category: item.category,
          title: item.title,
          action: item.action,
          expectedImpact: item.expectedImpact,
          urgency: item.urgency,
          confidence: item.confidence,
          priorityScore,
          explainability: item.explainability,
          requiresHumanApproval: true,
          status: "pending",
          generatedAt: new Date().toISOString(),
        };
        this.recommendations.set(recommendation.id, recommendation);
        return recommendation;
      })
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .map((item) => this.clone(item));
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
      explainableRecommendations: true,
      prioritizedRecommendations: true,
      humanApprovalRequired: true,
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }

  private clone(
    value: GrowthRecommendation,
  ): GrowthRecommendation {
    return JSON.parse(JSON.stringify(value)) as GrowthRecommendation;
  }
}