import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CampaignPlan,
  GrowthStrategy,
  ProductMarketInput,
} from "../contracts/adaptive-growth-engine.contracts";

@Injectable()
export class AdaptiveCampaignPlannerService {
  private readonly campaigns = new Map<string, CampaignPlan>();

  plan(
    input: ProductMarketInput,
    strategy: GrowthStrategy,
  ): CampaignPlan[] {
    const totalBudget = input.constraints?.budget ?? 10000;
    const channels = ["content", "email", "search", "social", "referral"];
    const now = new Date();
    const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return strategy.strategicPillars.slice(0, 3).map((pillar, index) => {
      const campaign: CampaignPlan = {
        id: `aage-campaign:${randomUUID()}`,
        tenantId: input.tenantId,
        productId: input.productId,
        strategyId: strategy.id,
        name: `${pillar.name} Campaign`,
        objective: pillar.objective,
        channels: channels.slice(index, index + 3),
        audiences: input.targetSegments,
        budget: Math.round(totalBudget / 3),
        startAt: now.toISOString(),
        endAt: end.toISOString(),
        expectedMetrics: {
          impressions: 100000,
          leads: 2500,
          conversions: 250,
          revenue: Math.round(totalBudget * 2.5),
        },
        status: "pending-approval",
        generatedAt: new Date().toISOString(),
      };
      this.campaigns.set(campaign.id, campaign);
      return this.clone(campaign);
    });
  }

  approve(id: string) {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    campaign.status = "approved";
    return this.clone(campaign);
  }

  list() {
    return [...this.campaigns.values()].map((item) => this.clone(item));
  }

  health() {
    return {
      status: "operational",
      campaigns: this.campaigns.size,
      channelPlanning: true,
      audiencePlanning: true,
      budgetGovernance: true,
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }

  private clone(value: CampaignPlan): CampaignPlan {
    return JSON.parse(JSON.stringify(value)) as CampaignPlan;
  }
}