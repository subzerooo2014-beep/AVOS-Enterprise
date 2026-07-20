import { Module } from "@nestjs/common";
import { ContinuousGrowthAdaptationService } from "./adaptation/continuous-growth-adaptation.service";
import { ProductMarketAnalysisService } from "./analysis/product-market-analysis.service";
import { AdaptiveCampaignPlannerService } from "./campaign/adaptive-campaign-planner.service";
import { AdaptiveGrowthEngineCertificationService } from "./certification/adaptive-growth-engine-certification.service";
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
import { AdaptiveGrowthEngineController } from "./adaptive-growth-engine.controller";

@Module({
  controllers: [AdaptiveGrowthEngineController],
  providers: [
    ProductMarketAnalysisService,
    GrowthOpportunityRadarService,
    AdaptiveGrowthStrategyService,
    AdaptiveCampaignPlannerService,
    GrowthExperimentEngineService,
    AdaptivePricingOptimizerService,
    AdaptiveRevenueForecastService,
    IntelligentGrowthRecommendationService,
    ContinuousGrowthAdaptationService,
    HumanGrowthAuthorityService,
    AdaptiveGrowthOrchestratorService,
    AdaptiveGrowthEngineHealthService,
    AdaptiveGrowthEngineVerificationService,
    AdaptiveGrowthEngineSmokeService,
    AdaptiveGrowthEngineCertificationService,
  ],
  exports: [
    ProductMarketAnalysisService,
    GrowthOpportunityRadarService,
    AdaptiveGrowthStrategyService,
    AdaptiveCampaignPlannerService,
    GrowthExperimentEngineService,
    AdaptivePricingOptimizerService,
    AdaptiveRevenueForecastService,
    IntelligentGrowthRecommendationService,
    ContinuousGrowthAdaptationService,
    HumanGrowthAuthorityService,
    AdaptiveGrowthOrchestratorService,
    AdaptiveGrowthEngineHealthService,
    AdaptiveGrowthEngineVerificationService,
    AdaptiveGrowthEngineSmokeService,
    AdaptiveGrowthEngineCertificationService,
  ],
})
export class AdaptiveGrowthEngineModule {}