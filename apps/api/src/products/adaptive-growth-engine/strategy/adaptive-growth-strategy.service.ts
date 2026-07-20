import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GrowthOpportunity,
  GrowthStrategy,
  ProductMarketAnalysis,
  ProductMarketInput,
} from "../contracts/adaptive-growth-engine.contracts";

@Injectable()
export class AdaptiveGrowthStrategyService {
  private readonly strategies = new Map<string, GrowthStrategy>();

  build(
    input: ProductMarketInput,
    analysis: ProductMarketAnalysis,
    opportunities: GrowthOpportunity[],
  ): GrowthStrategy {
    const top = opportunities.slice(0, 4);
    const strategy: GrowthStrategy = {
      id: `aage-strategy:${randomUUID()}`,
      tenantId: input.tenantId,
      productId: input.productId,
      name: `${input.productName} Adaptive Growth Strategy`,
      objective: "Create sustainable, measurable and governed growth.",
      horizonDays: 90,
      northStarMetric: "monthly-recurring-revenue",
      targets: {
        revenueGrowthRate: 20,
        conversionRateImprovement: 15,
        retentionRateImprovement: 10,
        churnReduction: 10,
      },
      strategicPillars: top.map((item, index) => ({
        name: item.title,
        objective: item.description,
        initiatives: [
          `Design initiative for ${item.category}`,
          `Launch controlled test for ${item.title}`,
          `Measure and adapt based on outcomes`,
        ],
        weight: Math.max(10, 35 - index * 5),
      })),
      assumptions: [
        `Growth readiness score is ${analysis.growthReadinessScore}`,
        "AGP production integration is operational",
        "Human approval is required before activation",
      ],
      risks: [...analysis.risks],
      status: "pending-approval",
      generatedAt: new Date().toISOString(),
    };
    this.strategies.set(strategy.id, strategy);
    return this.clone(strategy);
  }

  approve(id: string) {
    const strategy = this.strategies.get(id);
    if (!strategy) return undefined;
    strategy.status = "approved";
    return this.clone(strategy);
  }

  list() {
    return [...this.strategies.values()].map((item) => this.clone(item));
  }

  health() {
    return {
      status: "operational",
      strategies: this.strategies.size,
      adaptivePlanning: true,
      humanApprovalRequired: true,
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }

  private clone(value: GrowthStrategy): GrowthStrategy {
    return JSON.parse(JSON.stringify(value)) as GrowthStrategy;
  }
}