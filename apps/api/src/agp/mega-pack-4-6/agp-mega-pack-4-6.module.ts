import { Module } from "@nestjs/common";
import { AgpCampaignService } from "./campaign/agp-campaign.service";
import { AgpCustomerJourneyIntelligenceService } from "./campaign/agp-customer-journey-intelligence.service";
import { AgpFunnelIntelligenceService } from "./campaign/agp-funnel-intelligence.service";
import { AgpPack46CertificationService } from "./certification/agp-pack-4-6-certification.service";
import { AgpExecutiveGrowthDashboardService } from "./dashboard/agp-executive-growth-dashboard.service";
import { AgpConversionOptimizationService } from "./experimentation/agp-conversion-optimization.service";
import { AgpExperimentationService } from "./experimentation/agp-experimentation.service";
import { AgpPack46HealthService } from "./health/agp-pack-4-6-health.service";
import { AgpEnterpriseIntegrationService } from "./integration/agp-enterprise-integration.service";
import { AgpGrowthAttributionService } from "./revenue/agp-growth-attribution.service";
import { AgpPricingIntelligenceService } from "./revenue/agp-pricing-intelligence.service";
import { AgpRevenueForecastService } from "./revenue/agp-revenue-forecast.service";
import { AgpRevenueIntelligenceService } from "./revenue/agp-revenue-intelligence.service";
import { AgpPack46VerificationService } from "./verification/agp-pack-4-6-verification.service";
import { AgpMegaPack46Controller } from "./agp-mega-pack-4-6.controller";

@Module({
  controllers: [AgpMegaPack46Controller],
  providers: [
    AgpCampaignService,
    AgpFunnelIntelligenceService,
    AgpCustomerJourneyIntelligenceService,
    AgpExperimentationService,
    AgpConversionOptimizationService,
    AgpRevenueIntelligenceService,
    AgpPricingIntelligenceService,
    AgpRevenueForecastService,
    AgpGrowthAttributionService,
    AgpEnterpriseIntegrationService,
    AgpExecutiveGrowthDashboardService,
    AgpPack46HealthService,
    AgpPack46VerificationService,
    AgpPack46CertificationService,
  ],
  exports: [
    AgpCampaignService,
    AgpFunnelIntelligenceService,
    AgpCustomerJourneyIntelligenceService,
    AgpExperimentationService,
    AgpConversionOptimizationService,
    AgpRevenueIntelligenceService,
    AgpPricingIntelligenceService,
    AgpRevenueForecastService,
    AgpGrowthAttributionService,
    AgpEnterpriseIntegrationService,
    AgpExecutiveGrowthDashboardService,
    AgpPack46HealthService,
    AgpPack46VerificationService,
    AgpPack46CertificationService,
  ],
})
export class AgpMegaPack46Module {}