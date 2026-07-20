import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { ContinuousGrowthAdaptationService } from "./adaptation/continuous-growth-adaptation.service";
import { ProductMarketAnalysisService } from "./analysis/product-market-analysis.service";
import { AdaptiveCampaignPlannerService } from "./campaign/adaptive-campaign-planner.service";
import { AdaptiveGrowthEngineCertificationService } from "./certification/adaptive-growth-engine-certification.service";
import { ProductMarketInput } from "./contracts/adaptive-growth-engine.contracts";
import { GrowthExperimentEngineService } from "./experiment/growth-experiment-engine.service";
import { AdaptiveRevenueForecastService } from "./forecast/adaptive-revenue-forecast.service";
import { HumanGrowthAuthorityService } from "./governance/human-growth-authority.service";
import { AdaptiveGrowthEngineHealthService } from "./health/adaptive-growth-engine-health.service";
import { GrowthOpportunityRadarService } from "./opportunity/growth-opportunity-radar.service";
import { AdaptiveGrowthOrchestratorService } from "./orchestration/adaptive-growth-orchestrator.service";
import { AdaptivePricingOptimizerService } from "./pricing/adaptive-pricing-optimizer.service";
import { IntelligentGrowthRecommendationService } from "./recommendation/intelligent-growth-recommendation.service";
import { AdaptiveGrowthEngineSmokeService } from "./smoke/adaptive-growth-engine-smoke.service";
import { AdaptiveGrowthStrategyService } from "./strategy/adaptive-growth-strategy.service";
import { AdaptiveGrowthEngineVerificationService } from "./verification/adaptive-growth-engine-verification.service";

@Controller("avos/products/adaptive-growth-engine")
export class AdaptiveGrowthEngineController {
  constructor(
    private readonly orchestrator: AdaptiveGrowthOrchestratorService,
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
    private readonly authority: HumanGrowthAuthorityService,
    private readonly health: AdaptiveGrowthEngineHealthService,
    private readonly verification:
      AdaptiveGrowthEngineVerificationService,
    private readonly smoke: AdaptiveGrowthEngineSmokeService,
    private readonly certification:
      AdaptiveGrowthEngineCertificationService,
  ) {}

  @Get("status")
  status() {
    return this.health.status();
  }

  @Post("runs/generate")
  generate(@Body() body: ProductMarketInput) {
    return this.orchestrator.generate(body);
  }

  @Get("runs")
  runs() {
    return this.orchestrator.listRuns();
  }

  @Post("analysis")
  analyze(@Body() body: ProductMarketInput) {
    return this.analysis.analyze(body);
  }

  @Get("analysis")
  analyses() {
    return this.analysis.list();
  }

  @Get("opportunities")
  opportunityList() {
    return this.opportunities.list();
  }

  @Get("strategies")
  strategies() {
    return this.strategy.list();
  }

  @Get("campaigns")
  campaignList() {
    return this.campaigns.list();
  }

  @Get("experiments")
  experimentList() {
    return this.experiments.list();
  }

  @Post("experiments/:id/complete")
  completeExperiment(
    @Param("id") id: string,
    @Body() body: any,
  ) {
    return this.experiments.complete(id, body);
  }

  @Get("pricing")
  pricingList() {
    return this.pricing.list();
  }

  @Get("forecasts")
  forecasts() {
    return this.forecast.list();
  }

  @Get("recommendations")
  recommendationList() {
    return this.recommendations.list();
  }

  @Post("adaptation")
  createAdaptation(@Body() body: any) {
    return this.orchestrator.createAdaptation(body);
  }

  @Get("adaptation")
  adaptationList() {
    return this.adaptation.list();
  }

  @Post("approvals")
  approve(@Body() body: any) {
    return this.authority.decide(body);
  }

  @Get("approvals")
  approvals() {
    return this.authority.list();
  }

  @Post("verification/run")
  verify() {
    return this.verification.run();
  }

  @Get("verification/status")
  verificationStatus() {
    return this.verification.status();
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }

  @Get("smoke/status")
  smokeStatus() {
    return this.smoke.status();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.certification.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }

  @Get("certification/history")
  certificationHistory() {
    return this.certification.historyList();
  }
}