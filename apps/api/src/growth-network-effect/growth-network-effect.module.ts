import { Module } from "@nestjs/common";
import { GrowthNetworkEffectController } from "./growth-network-effect.controller";
import { GrowthNetworkEffectService } from "./growth-network-effect.service";
import { CampaignPolicy } from "./policies/campaign.policy";
import { ReferralPolicy } from "./policies/referral.policy";
import { SeoPolicy } from "./policies/seo.policy";
import { SocialPolicy } from "./policies/social.policy";
import { AbTestPolicy } from "./policies/ab-test.policy";
import { RetentionPolicy } from "./policies/retention.policy";
import { RevenuePolicy } from "./policies/revenue.policy";
import { InfluencerPolicy } from "./policies/influencer.policy";
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
import { GrowthAuditService } from "./services/growth-audit.service";
import { GrowthAlertService } from "./services/growth-alert.service";
import { GrowthReportingService } from "./services/growth-reporting.service";
import { GrowthSegmentService } from "./services/growth-segment.service";
import { GrowthExperimentService } from "./services/growth-experiment.service";
import { GrowthDashboardService } from "./services/growth-dashboard.service";
import { GrowthBrainEngine } from "./ai/growth-brain.engine";
import { RetentionAiEngine } from "./ai/retention-ai.engine";
import { RevenueOptimizerEngine } from "./ai/revenue-optimizer.engine";
import { ViralEngine } from "./ai/viral-engine";
import { SeoIntelligenceEngine } from "./ai/seo-intelligence.engine";
import { CompetitorIntelligenceEngine } from "./ai/competitor-intelligence.engine";
import { ContentIntelligenceEngine } from "./ai/content-intelligence.engine";
import { JourneyGenomeEngine } from "./ai/journey-genome.engine";
import { StrategistAgent } from "./agents/strategist.agent";
import { CopywriterAgent } from "./agents/copywriter.agent";
import { SocialAgent } from "./agents/social.agent";
import { SeoAgent } from "./agents/seo.agent";
import { AnalyticsAgent } from "./agents/analytics.agent";
import { AdsAgent } from "./agents/ads.agent";
import { InfluencerAgent } from "./agents/influencer.agent";
import { RetentionAgent } from "./agents/retention.agent";

@Module({
 controllers:[GrowthNetworkEffectController],
 providers:[
  GrowthNetworkEffectService,
  CampaignPolicy,ReferralPolicy,SeoPolicy,SocialPolicy,AbTestPolicy,RetentionPolicy,RevenuePolicy,InfluencerPolicy,
  CampaignService,ReferralService,SeoService,SocialDistributionService,ContentFactoryService,AbTestService,RetentionService,
  GrowthRevenueService,InfluencerService,CompetitorService,JourneyGenomeService,NotificationIntelligenceService,
  GrowthAuditService,GrowthAlertService,GrowthReportingService,GrowthSegmentService,GrowthExperimentService,GrowthDashboardService,
  GrowthBrainEngine,RetentionAiEngine,RevenueOptimizerEngine,ViralEngine,SeoIntelligenceEngine,CompetitorIntelligenceEngine,
  ContentIntelligenceEngine,JourneyGenomeEngine,
  StrategistAgent,CopywriterAgent,SocialAgent,SeoAgent,AnalyticsAgent,AdsAgent,InfluencerAgent,RetentionAgent
 ],
 exports:[GrowthNetworkEffectService],
})
export class GrowthNetworkEffectModule {}
