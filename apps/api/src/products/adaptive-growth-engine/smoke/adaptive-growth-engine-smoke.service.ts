import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AdaptiveGrowthOrchestratorService } from "../orchestration/adaptive-growth-orchestrator.service";
import { AdaptiveGrowthEngineVerificationService } from "../verification/adaptive-growth-engine-verification.service";

@Injectable()
export class AdaptiveGrowthEngineSmokeService {
  private latest?: Record<string, unknown>;

  constructor(
    private readonly orchestrator: AdaptiveGrowthOrchestratorService,
    private readonly verification:
      AdaptiveGrowthEngineVerificationService,
  ) {}

  run() {
    const verification = this.verification.run();
    const product = this.orchestrator.generate({
      tenantId: "smoke-tenant",
      productId: "smoke-product",
      productName: "Adaptive Growth Smoke Product",
      category: "software",
      stage: "growth",
      targetMarkets: ["UAE", "GCC"],
      targetSegments: ["SMB", "Enterprise"],
      valueProposition: "Adaptive AI-driven growth",
      currentMetrics: {
        revenue: 100000,
        customers: 1000,
        conversionRate: 0.06,
        retentionRate: 0.72,
        churnRate: 0.06,
        averageOrderValue: 150,
        acquisitionCost: 40,
        lifetimeValue: 500,
      },
      constraints: {
        budget: 30000,
        riskTolerance: "medium",
      },
    });

    const checks = {
      verificationPassed: verification.status === "passed",
      productAnalysisCreated: Boolean(product.analysis.id),
      opportunitiesCreated: product.opportunities.length > 0,
      strategyCreated: Boolean(product.strategy.id),
      campaignsCreated: product.campaigns.length > 0,
      experimentsCreated: product.experiments.length > 0,
      pricingRecommendationCreated: Boolean(product.pricing.id),
      revenueForecastCreated: Boolean(product.forecast.id),
      recommendationsCreated: product.recommendations.length > 0,
      approvalGatePreserved:
        product.run.status === "pending-approval",
      humanFinalAuthority:
        product.governance.humanFinalAuthority === true,
    };
    const findings = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);
    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length) *
        100,
    );

    this.latest = {
      id: `aage-smoke:${randomUUID()}`,
      status: findings.length === 0 ? "passed" : "failed",
      score,
      checks,
      findings,
      generatedAt: new Date().toISOString(),
    };
    return this.latest;
  }

  status() {
    return this.latest ?? {
      status: "not-run",
      generatedAt: new Date().toISOString(),
    };
  }
}