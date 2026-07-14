import { Injectable } from "@nestjs/common";
import { CampaignService } from "./services/campaign.service";
import { ReferralService } from "./services/referral.service";
import { SeoService } from "./services/seo.service";
import { SocialDistributionService } from "./services/social-distribution.service";
import { ContentFactoryService } from "./services/content-factory.service";
import { AbTestService } from "./services/ab-test.service";
import { RetentionService } from "./services/retention.service";
import { GrowthRevenueService } from "./services/revenue.service";
import { InfluencerService } from "./services/influencer.service";
import { CompetitorService } from "./services/competitor.service";
import { JourneyGenomeService } from "./services/journey-genome.service";
import { NotificationIntelligenceService } from "./services/notification-intelligence.service";
@Injectable()
export class GrowthNetworkEffectService {
  constructor(
    readonly campaigns:CampaignService,readonly referrals:ReferralService,readonly seo:SeoService,
    readonly social:SocialDistributionService,readonly content:ContentFactoryService,readonly abTests:AbTestService,
    readonly retention:RetentionService,readonly revenue:GrowthRevenueService,readonly influencers:InfluencerService,
    readonly competitors:CompetitorService,readonly journeys:JourneyGenomeService,readonly notifications:NotificationIntelligenceService
  ){}
}
