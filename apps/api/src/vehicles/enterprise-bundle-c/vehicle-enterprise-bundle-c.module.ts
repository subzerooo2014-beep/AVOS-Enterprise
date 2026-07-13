import { Module } from "@nestjs/common";
import { VehicleRiskAggregationService } from "./vehicle-risk-aggregation.service";
import { VehicleOpportunityScoringService } from "./vehicle-opportunity-scoring.service";
import { VehicleListingQualityService } from "./vehicle-listing-quality.service";
import { VehicleMediaIntelligenceService } from "./vehicle-media-intelligence.service";
import { VehicleDocumentIntelligenceService } from "./vehicle-document-intelligence.service";
import { VehicleBuyerDemandService } from "./vehicle-buyer-demand.service";
import { VehicleSellerPerformanceService } from "./vehicle-seller-performance.service";
import { VehiclePricePositioningService } from "./vehicle-price-positioning.service";
import { VehicleConversionForecastService } from "./vehicle-conversion-forecast.service";
import { VehicleActionRecommendationService } from "./vehicle-action-recommendation.service";
import { VehiclePriorityQueueService } from "./vehicle-priority-queue.service";
import { VehiclePortfolioBalancingService } from "./vehicle-portfolio-balancing.service";
import { VehicleMarketPulseService } from "./vehicle-market-pulse.service";
import { VehicleEnterpriseInsightService } from "./vehicle-enterprise-insight.service";
import { VehicleEnterpriseBundleCController } from "./vehicle-enterprise-bundle-c.controller";

@Module({
  controllers: [VehicleEnterpriseBundleCController],
  providers: [
    VehicleRiskAggregationService,
    VehicleOpportunityScoringService,
    VehicleListingQualityService,
    VehicleMediaIntelligenceService,
    VehicleDocumentIntelligenceService,
    VehicleBuyerDemandService,
    VehicleSellerPerformanceService,
    VehiclePricePositioningService,
    VehicleConversionForecastService,
    VehicleActionRecommendationService,
    VehiclePriorityQueueService,
    VehiclePortfolioBalancingService,
    VehicleMarketPulseService,
    VehicleEnterpriseInsightService,
  ],
  exports: [
    VehicleRiskAggregationService,
    VehicleOpportunityScoringService,
    VehicleListingQualityService,
    VehicleMediaIntelligenceService,
    VehicleDocumentIntelligenceService,
    VehicleBuyerDemandService,
    VehicleSellerPerformanceService,
    VehiclePricePositioningService,
    VehicleConversionForecastService,
    VehicleActionRecommendationService,
    VehiclePriorityQueueService,
    VehiclePortfolioBalancingService,
    VehicleMarketPulseService,
    VehicleEnterpriseInsightService,
  ],
})
export class VehicleEnterpriseBundleCModule {}
