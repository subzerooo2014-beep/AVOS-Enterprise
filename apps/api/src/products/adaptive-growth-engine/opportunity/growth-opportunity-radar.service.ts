import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GrowthOpportunity,
  ProductMarketAnalysis,
  ProductMarketInput,
} from "../contracts/adaptive-growth-engine.contracts";

@Injectable()
export class GrowthOpportunityRadarService {
  private readonly opportunities = new Map<string, GrowthOpportunity>();

  detect(
    input: ProductMarketInput,
    analysis: ProductMarketAnalysis,
  ): GrowthOpportunity[] {
    const metrics = input.currentMetrics;
    const candidates = [
      {
        title: "Improve conversion funnel",
        category: "activation" as const,
        description: "Optimize landing, onboarding and conversion journeys.",
        impact: metrics.conversionRate < 0.05 ? 95 : 70,
        confidence: 88,
        effort: 55,
        risk: 20,
      },
      {
        title: "Reduce customer churn",
        category: "retention" as const,
        description: "Introduce segmented retention and recovery journeys.",
        impact: metrics.churnRate > 0.08 ? 95 : 65,
        confidence: 90,
        effort: 60,
        risk: 15,
      },
      {
        title: "Optimize pricing and packaging",
        category: "revenue" as const,
        description: "Test value-based packages and price elasticity.",
        impact: 82,
        confidence: 78,
        effort: 45,
        risk: 35,
      },
      {
        title: "Scale high-fit acquisition channels",
        category: "acquisition" as const,
        description: "Allocate growth budget toward efficient audience-channel pairs.",
        impact: 85,
        confidence: 80,
        effort: 65,
        risk: 30,
      },
      {
        title: "Launch referral growth loop",
        category: "referral" as const,
        description: "Create a governed customer referral and advocacy system.",
        impact: 72,
        confidence: 75,
        effort: 50,
        risk: 15,
      },
      {
        title: "Expand into priority market",
        category: "market-expansion" as const,
        description: `Prioritize expansion across ${input.targetMarkets.join(", ")}.`,
        impact: analysis.marketScore,
        confidence: 70,
        effort: 80,
        risk: 45,
      },
    ];

    return candidates
      .map((candidate) => {
        const priorityScore = Math.round(
          candidate.impact * 0.4 +
            candidate.confidence * 0.3 +
            (100 - candidate.effort) * 0.15 +
            (100 - candidate.risk) * 0.15,
        );
        const opportunity: GrowthOpportunity = {
          id: `aage-opportunity:${randomUUID()}`,
          tenantId: input.tenantId,
          productId: input.productId,
          title: candidate.title,
          category: candidate.category,
          description: candidate.description,
          expectedImpact: candidate.impact,
          confidence: candidate.confidence,
          effort: candidate.effort,
          risk: candidate.risk,
          priorityScore,
          rationale: [
            `Expected impact: ${candidate.impact}`,
            `Confidence: ${candidate.confidence}`,
            `Effort: ${candidate.effort}`,
            `Risk: ${candidate.risk}`,
          ],
          status: "identified",
          generatedAt: new Date().toISOString(),
        };
        this.opportunities.set(opportunity.id, opportunity);
        return opportunity;
      })
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .map((item) => this.clone(item));
  }

  list() {
    return [...this.opportunities.values()].map((item) => this.clone(item));
  }

  health() {
    return {
      status: "operational",
      opportunities: this.opportunities.size,
      opportunityScoring: true,
      explainableRanking: true,
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }

  private clone(value: GrowthOpportunity): GrowthOpportunity {
    return JSON.parse(JSON.stringify(value)) as GrowthOpportunity;
  }
}