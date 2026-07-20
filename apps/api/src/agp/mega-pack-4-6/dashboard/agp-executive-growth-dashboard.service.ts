import { Injectable } from "@nestjs/common";
import { ExecutiveGrowthDashboard } from "../contracts/agp-enterprise-integration.contracts";
import { AgpCampaignService } from "../campaign/agp-campaign.service";
import { AgpExperimentationService } from "../experimentation/agp-experimentation.service";
import { AgpEnterpriseIntegrationService } from "../integration/agp-enterprise-integration.service";
import { AgpGrowthAttributionService } from "../revenue/agp-growth-attribution.service";
import { AgpRevenueForecastService } from "../revenue/agp-revenue-forecast.service";
import { AgpRevenueIntelligenceService } from "../revenue/agp-revenue-intelligence.service";

@Injectable()
export class AgpExecutiveGrowthDashboardService {
  constructor(
    private readonly campaigns: AgpCampaignService,
    private readonly experiments: AgpExperimentationService,
    private readonly revenue: AgpRevenueIntelligenceService,
    private readonly forecast: AgpRevenueForecastService,
    private readonly attribution: AgpGrowthAttributionService,
    private readonly integrations: AgpEnterpriseIntegrationService,
  ) {}

  build(): ExecutiveGrowthDashboard {
    const campaignList = this.campaigns.list();
    const experimentList = this.experiments.list();
    const revenue = this.revenue.latest();
    const forecast = this.forecast.latest();
    const attribution = this.attribution.latest();
    const integrationHealth = this.integrations.health();
    const forecastTotal =
      forecast?.points.reduce(
        (sum, point) => sum + point.predictedRevenue,
        0,
      ) ?? 0;

    const alerts: string[] = [];
    if (campaignList.filter((item) => item.status === "active").length === 0) {
      alerts.push("No active campaigns.");
    }
    if (revenue.transactionCount === 0) {
      alerts.push("Revenue evidence is not available.");
    }
    if (integrationHealth.healthy !== integrationHealth.total) {
      alerts.push("One or more enterprise integrations are degraded.");
    }

    const score = Math.max(
      0,
      100 -
        alerts.length * 10 -
        (integrationHealth.total - integrationHealth.healthy) * 10,
    );

    return {
      name: "AGP Executive Growth Dashboard",
      version: "AGP-MP4-6-1.0.0",
      score,
      summary: {
        campaigns: campaignList.length,
        activeCampaigns: campaignList.filter(
          (item) => item.status === "active",
        ).length,
        experiments: experimentList.length,
        revenue: revenue.totalRevenue,
        forecast: Number(forecastTotal.toFixed(2)),
        attributedRevenue: attribution?.totalRevenue ?? 0,
        integrationsHealthy: integrationHealth.healthy,
        integrationsTotal: integrationHealth.total,
      },
      alerts,
      recommendations: [
        "Prioritize evidence-backed growth initiatives.",
        "Use experiments before scaling conversion changes.",
        "Require human approval for campaign, pricing and revenue decisions.",
      ],
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      generatedAt: new Date().toISOString(),
    };
  }
}