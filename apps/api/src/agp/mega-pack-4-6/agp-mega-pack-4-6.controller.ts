import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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

@Controller("avos/agp/mega-pack-4-6")
export class AgpMegaPack46Controller {
  constructor(
    private readonly campaigns: AgpCampaignService,
    private readonly funnels: AgpFunnelIntelligenceService,
    private readonly journeys: AgpCustomerJourneyIntelligenceService,
    private readonly experiments: AgpExperimentationService,
    private readonly conversion: AgpConversionOptimizationService,
    private readonly revenue: AgpRevenueIntelligenceService,
    private readonly pricing: AgpPricingIntelligenceService,
    private readonly forecast: AgpRevenueForecastService,
    private readonly attribution: AgpGrowthAttributionService,
    private readonly integrations: AgpEnterpriseIntegrationService,
    private readonly dashboard: AgpExecutiveGrowthDashboardService,
    private readonly health: AgpPack46HealthService,
    private readonly verification: AgpPack46VerificationService,
    private readonly certification: AgpPack46CertificationService,
  ) {}

  @Get("status")
  status() {
    return this.health.status();
  }

  @Post("campaigns")
  createCampaign(@Body() body: any) {
    return this.campaigns.create(body);
  }

  @Get("campaigns")
  listCampaigns() {
    return this.campaigns.list();
  }

  @Post("campaigns/:id/status")
  updateCampaignStatus(
    @Param("id") id: string,
    @Body() body: { status: any; approvedBy?: string },
  ) {
    return this.campaigns.updateStatus(
      id,
      body.status,
      body.approvedBy,
    );
  }

  @Post("funnels/analyze")
  analyzeFunnel(@Body() body: any) {
    return this.funnels.analyze(body);
  }

  @Post("journeys/analyze")
  analyzeJourney(@Body() body: any) {
    return this.journeys.analyze(body);
  }

  @Post("experiments")
  createExperiment(@Body() body: any) {
    return this.experiments.create(body);
  }

  @Post("experiments/:id/start")
  startExperiment(
    @Param("id") id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.experiments.start(id, body.approvedBy);
  }

  @Post("experiments/:id/record")
  recordExperiment(
    @Param("id") id: string,
    @Body()
    body: {
      variantId: string;
      participants: number;
      conversions: number;
    },
  ) {
    return this.experiments.record(
      id,
      body.variantId,
      body.participants,
      body.conversions,
    );
  }

  @Post("experiments/:id/complete")
  completeExperiment(
    @Param("id") id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.experiments.complete(id, body.approvedBy);
  }

  @Post("conversion/optimize")
  optimizeConversion(@Body() body: any) {
    return this.conversion.optimize(body);
  }

  @Post("revenue/ingest")
  ingestRevenue(@Body() body: any) {
    return this.revenue.ingest(body);
  }

  @Post("revenue/analyze")
  analyzeRevenue(@Body() body: { period?: string }) {
    return this.revenue.analyze(body.period);
  }

  @Post("pricing/evaluate")
  evaluatePricing(@Body() body: any) {
    return this.pricing.evaluate(body);
  }

  @Post("forecast/generate")
  generateForecast(@Body() body: any) {
    return this.forecast.forecast(body);
  }

  @Post("attribution/calculate")
  calculateAttribution(@Body() body: any) {
    return this.attribution.attribute(body);
  }

  @Get("integrations")
  integrationStatus() {
    return this.integrations.health();
  }

  @Get("dashboard")
  executiveDashboard() {
    return this.dashboard.build();
  }

  @Post("verification/run")
  runVerification() {
    return this.verification.run();
  }

  @Get("verification/status")
  verificationStatus() {
    return this.verification.status();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.certification.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }
}