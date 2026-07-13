import { Body, Controller, Get, Post } from "@nestjs/common";
import { VehicleRiskAggregationService } from "./vehicle-risk-aggregation.service";
import { VehicleOpportunityScoringService } from "./vehicle-opportunity-scoring.service";
import { VehicleListingQualityService } from "./vehicle-listing-quality.service";
import { VehicleEnterpriseInsightService } from "./vehicle-enterprise-insight.service";
import { VehicleActionRecommendationService } from "./vehicle-action-recommendation.service";

@Controller("vehicle-enterprise-bundle-c")
export class VehicleEnterpriseBundleCController {
  constructor(
    private readonly risk: VehicleRiskAggregationService,
    private readonly opportunity: VehicleOpportunityScoringService,
    private readonly quality: VehicleListingQualityService,
    private readonly insight: VehicleEnterpriseInsightService,
    private readonly action: VehicleActionRecommendationService,
  ) {}

  @Post("evaluate")
  evaluate(
    @Body()
    input: {
      fraudRisk: number;
      complianceRisk: number;
      operationalRisk: number;
      marketRisk: number;
      demandScore: number;
      marginScore: number;
      trustScore: number;
      conversionScore: number;
      mediaScore: number;
      descriptionScore: number;
      documentScore: number;
      completenessScore: number;
    },
  ) {
    const risk = this.risk.aggregate(input);
    const opportunity = this.opportunity.score(input);
    const quality = this.quality.evaluate(input);
    const insight = this.insight.compose({
      riskScore: risk.riskScore,
      opportunityScore: opportunity.opportunityScore,
      qualityScore: quality.qualityScore,
      conversionScore: input.conversionScore,
    });
    const action = this.action.recommend({
      riskScore: risk.riskScore,
      opportunityScore: opportunity.opportunityScore,
      qualityScore: quality.qualityScore,
    });

    return {
      success: true,
      risk,
      opportunity,
      quality,
      insight,
      action,
    };
  }

  @Get("status")
  status() {
    return {
      success: true,
      system: "AVOS Vehicle Enterprise Bundle C",
      status: "running",
      packs: "21-35",
      capabilities: 15,
    };
  }
}
