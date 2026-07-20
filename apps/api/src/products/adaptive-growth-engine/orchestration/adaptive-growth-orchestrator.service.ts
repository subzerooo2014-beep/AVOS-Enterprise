import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AdaptiveGrowthRun,
  ProductMarketInput,
} from "../contracts/adaptive-growth-engine.contracts";
import { ContinuousGrowthAdaptationService } from "../adaptation/continuous-growth-adaptation.service";
import { ProductMarketAnalysisService } from "../analysis/product-market-analysis.service";
import { AdaptiveCampaignPlannerService } from "../campaign/adaptive-campaign-planner.service";
import { GrowthExperimentEngineService } from "../experiment/growth-experiment-engine.service";
import { AdaptiveRevenueForecastService } from "../forecast/adaptive-revenue-forecast.service";
import { GrowthOpportunityRadarService } from "../opportunity/growth-opportunity-radar.service";
import { AdaptivePricingOptimizerService } from "../pricing/adaptive-pricing-optimizer.service";
import { IntelligentGrowthRecommendationService } from "../recommendation/intelligent-growth-recommendation.service";
import { AdaptiveGrowthStrategyService } from "../strategy/adaptive-growth-strategy.service";

@Injectable()
export class AdaptiveGrowthOrchestratorService {
  private readonly runs = new Map<string, AdaptiveGrowthRun>();

  constructor(
    private readonly analysis: ProductMarketAnalysisService,
    private readonly opportunities: GrowthOpportunityRadarService,
    private readonly strategy: AdaptiveGrowthStrategyService,
    private readonly campaigns: AdaptiveCampaignPlannerService,
    private readonly experiments: GrowthExperimentEngineService,
    private readonly pricing: AdaptivePricingOptimizerService,
    private readonly forecast: AdaptiveRevenueForecastService,
    private readonly recommendations:
      IntelligentGrowthRecommendationService,
    private readonly adaptation:
      ContinuousGrowthAdaptationService,
  ) {}

  generate(input: ProductMarketInput) {
    const analysis = this.analysis.analyze(input);
    const opportunities = this.opportunities.detect(input, analysis);
    const strategy = this.strategy.build(
      input,
      analysis,
      opportunities,
    );
    const campaigns = this.campaigns.plan(input, strategy);
    const experiments = this.experiments.design(
      input,
      opportunities,
    );
    const pricing = this.pricing.recommend(input);
    const forecast = this.forecast.forecast(input);
    const recommendations = this.recommendations.generate({
      analysis,
      opportunities,
      pricing,
      forecast,
    });

    const run: AdaptiveGrowthRun = {
      id: `aage-run:${randomUUID()}`,
      tenantId: input.tenantId,
      productId: input.productId,
      analysisId: analysis.id,
      strategyId: strategy.id,
      opportunityIds: opportunities.map((item) => item.id),
      campaignIds: campaigns.map((item) => item.id),
      experimentIds: experiments.map((item) => item.id),
      pricingRecommendationId: pricing.id,
      revenueForecastId: forecast.id,
      recommendationIds: recommendations.map((item) => item.id),
      status: "pending-approval",
      generatedAt: new Date().toISOString(),
    };
    this.runs.set(run.id, run);

    return {
      run,
      analysis,
      opportunities,
      strategy,
      campaigns,
      experiments,
      pricing,
      forecast,
      recommendations,
      governance: {
        humanFinalAuthority: true,
        activationRequiresApproval: true,
      },
    };
  }

  createAdaptation(input: {
    tenantId: string;
    productId: string;
    previousState: Record<string, number>;
    currentState: Record<string, number>;
  }) {
    return this.adaptation.adapt({
      ...input,
      recommendations: this.recommendations
        .list()
        .filter((item) => item.productId === input.productId),
    });
  }

  listRuns() {
    return [...this.runs.values()].map((item) => ({ ...item }));
  }

  health() {
    return {
      status: "operational",
      runs: this.runs.size,
      fullGrowthLifecycle: true,
      agpPlatformConsumer: true,
      humanFinalAuthority: true,
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }
}