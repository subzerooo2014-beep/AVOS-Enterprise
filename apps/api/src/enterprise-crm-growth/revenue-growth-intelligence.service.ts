import { Injectable } from '@nestjs/common';
import {
  CampaignMetric,
  Opportunity,
} from './enterprise-crm-growth.types';

@Injectable()
export class RevenueGrowthIntelligenceService {
  analyze(
    opportunities: Opportunity[],
    campaigns: CampaignMetric[],
  ) {
    const pipeline = opportunities.reduce(
      (sum, opportunity) =>
        sum + opportunity.value * opportunity.probability,
      0,
    );
    const campaignRevenue = campaigns.reduce(
      (sum, campaign) => sum + campaign.revenue,
      0,
    );

    return {
      weightedPipeline: Number(pipeline.toFixed(2)),
      campaignRevenue,
      projectedRevenue: Number(
        (pipeline + campaignRevenue).toFixed(2),
      ),
    };
  }
}