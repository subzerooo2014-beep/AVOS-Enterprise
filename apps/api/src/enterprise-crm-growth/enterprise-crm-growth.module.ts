import { Module } from '@nestjs/common';
import { EnterpriseCrmGrowthController } from './enterprise-crm-growth.controller';
import { Customer360EngineService } from './customer-360-engine.service';
import { CustomerSuccessEngineService } from './customer-success-engine.service';
import { CustomerHealthScoreEngineService } from './customer-health-score-engine.service';
import { CustomerJourneyIntelligenceService } from './customer-journey-intelligence.service';
import { LeadLifecycleEngineService } from './lead-lifecycle-engine.service';
import { OpportunityManagementEngineService } from './opportunity-management-engine.service';
import { SalesPipelineIntelligenceService } from './sales-pipeline-intelligence.service';
import { CustomerCommunicationHubService } from './customer-communication-hub.service';
import { LoyaltyRewardsEngineService } from './loyalty-rewards-engine.service';
import { ReferralIntelligenceEngineService } from './referral-intelligence-engine.service';
import { CustomerRetentionAiService } from './customer-retention-ai.service';
import { ChurnPredictionEngineService } from './churn-prediction-engine.service';
import { CustomerFeedbackNpsEngineService } from './customer-feedback-nps-engine.service';
import { MarketingCampaignIntelligenceService } from './marketing-campaign-intelligence.service';
import { SegmentationPersonalizationAiService } from './segmentation-personalization-ai.service';
import { RevenueGrowthIntelligenceService } from './revenue-growth-intelligence.service';
import { CustomerSuccessOrchestratorService } from './customer-success-orchestrator.service';
import { ExecutiveCrmDashboardService } from './executive-crm-dashboard.service';

@Module({
  controllers: [EnterpriseCrmGrowthController],
  providers: [
    Customer360EngineService,
    CustomerSuccessEngineService,
    CustomerHealthScoreEngineService,
    CustomerJourneyIntelligenceService,
    LeadLifecycleEngineService,
    OpportunityManagementEngineService,
    SalesPipelineIntelligenceService,
    CustomerCommunicationHubService,
    LoyaltyRewardsEngineService,
    ReferralIntelligenceEngineService,
    CustomerRetentionAiService,
    ChurnPredictionEngineService,
    CustomerFeedbackNpsEngineService,
    MarketingCampaignIntelligenceService,
    SegmentationPersonalizationAiService,
    RevenueGrowthIntelligenceService,
    CustomerSuccessOrchestratorService,
    ExecutiveCrmDashboardService,
  ],
  exports: [
    Customer360EngineService,
    CustomerSuccessEngineService,
    CustomerHealthScoreEngineService,
    CustomerJourneyIntelligenceService,
    LeadLifecycleEngineService,
    OpportunityManagementEngineService,
    SalesPipelineIntelligenceService,
    CustomerCommunicationHubService,
    LoyaltyRewardsEngineService,
    ReferralIntelligenceEngineService,
    CustomerRetentionAiService,
    ChurnPredictionEngineService,
    CustomerFeedbackNpsEngineService,
    MarketingCampaignIntelligenceService,
    SegmentationPersonalizationAiService,
    RevenueGrowthIntelligenceService,
    CustomerSuccessOrchestratorService,
    ExecutiveCrmDashboardService,
  ],
})
export class EnterpriseCrmGrowthModule {}