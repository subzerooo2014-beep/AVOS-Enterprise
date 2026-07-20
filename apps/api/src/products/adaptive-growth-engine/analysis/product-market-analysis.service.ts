import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  ProductMarketAnalysis,
  ProductMarketInput,
} from "../contracts/adaptive-growth-engine.contracts";

@Injectable()
export class ProductMarketAnalysisService {
  private readonly analyses = new Map<string, ProductMarketAnalysis>();

  analyze(input: ProductMarketInput): ProductMarketAnalysis {
    const metrics = input.currentMetrics;
    const unitEconomics =
      metrics.lifetimeValue > 0 && metrics.acquisitionCost > 0
        ? metrics.lifetimeValue / metrics.acquisitionCost
        : 0;
    const productScore = this.clamp(
      45 +
        metrics.conversionRate * 100 +
        metrics.retentionRate * 30 -
        metrics.churnRate * 35 +
        Math.min(20, unitEconomics * 4),
    );
    const marketScore = this.clamp(
      55 +
        input.targetMarkets.length * 5 +
        input.targetSegments.length * 3 +
        (input.stage === "growth" ? 15 : input.stage === "mature" ? 10 : 5),
    );
    const growthReadinessScore = Math.round(
      (productScore + marketScore) / 2,
    );

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    if (metrics.retentionRate >= 0.6) strengths.push("Strong customer retention");
    else weaknesses.push("Retention requires improvement");
    if (unitEconomics >= 3) strengths.push("Healthy LTV to CAC ratio");
    else weaknesses.push("Unit economics require optimization");
    if (metrics.conversionRate >= 0.05) strengths.push("Healthy conversion foundation");
    else weaknesses.push("Conversion funnel is underperforming");
    if (metrics.churnRate <= 0.08) strengths.push("Controlled churn");
    else weaknesses.push("Churn reduction is a priority");

    const analysis: ProductMarketAnalysis = {
      id: `aage-analysis:${randomUUID()}`,
      tenantId: input.tenantId,
      productId: input.productId,
      productScore,
      marketScore,
      growthReadinessScore,
      strengths,
      weaknesses,
      marketSignals: [
        `Target markets available: ${input.targetMarkets.length}`,
        `Addressable audience segments: ${input.targetSegments.length}`,
        `Product stage: ${input.stage}`,
      ],
      risks: [
        ...(input.constraints?.riskTolerance === "low"
          ? ["Low risk tolerance may constrain experimentation velocity"]
          : []),
        ...(input.constraints?.complianceNotes ?? []),
      ],
      recommendedFocus: [
        weaknesses.includes("Retention requires improvement")
          ? "Retention improvement"
          : "Retention expansion",
        weaknesses.includes("Conversion funnel is underperforming")
          ? "Conversion optimization"
          : "Acquisition scaling",
        unitEconomics < 3
          ? "Pricing and acquisition efficiency"
          : "Revenue expansion",
      ],
      evidence: [
        {
          source: "product-metrics",
          description: "Current product and commercial performance",
          confidence: 1,
        },
        {
          source: "market-input",
          description: "Declared markets and audience segments",
          confidence: 0.9,
        },
      ],
      generatedAt: new Date().toISOString(),
    };
    this.analyses.set(analysis.id, analysis);
    return this.clone(analysis);
  }

  get(id: string) {
    const item = this.analyses.get(id);
    return item ? this.clone(item) : undefined;
  }

  list() {
    return [...this.analyses.values()].map((item) => this.clone(item));
  }

  health() {
    return {
      status: "operational",
      analyses: this.analyses.size,
      explainableAnalysis: true,
      evidenceProvenance: true,
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  private clone(value: ProductMarketAnalysis): ProductMarketAnalysis {
    return JSON.parse(JSON.stringify(value)) as ProductMarketAnalysis;
  }
}