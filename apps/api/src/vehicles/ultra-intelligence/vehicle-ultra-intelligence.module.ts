import { Module } from "@nestjs/common";
import { BuyerIntelligenceService } from "./buyer-intelligence.service";
import { DealerIntelligenceService } from "./dealer-intelligence.service";
import { RecommendationIntelligenceService } from "./recommendation-intelligence.service";
import { InspectionWorkflowService } from "./inspection-workflow.service";
import { SmartRulesEngineService } from "./smart-rules-engine.service";
import { LeadIntelligenceService } from "./lead-intelligence.service";
import { MarketplaceRankingService } from "./marketplace-ranking.service";
import { TrustIntelligenceService } from "./trust-intelligence.service";
import { SalesIntelligenceService } from "./sales-intelligence.service";
import { ExportIntelligenceService } from "./export-intelligence.service";
import { FinancingIntelligenceService } from "./financing-intelligence.service";
import { InsuranceIntelligenceService } from "./insurance-intelligence.service";
import { NotificationIntelligenceService } from "./notification-intelligence.service";
import { EnterpriseWorkflowService } from "./enterprise-workflow.service";
import { AiDecisionFlowService } from "./ai-decision-flow.service";

@Module({
  providers: [
    BuyerIntelligenceService,
    DealerIntelligenceService,
    RecommendationIntelligenceService,
    InspectionWorkflowService,
    SmartRulesEngineService,
    LeadIntelligenceService,
    MarketplaceRankingService,
    TrustIntelligenceService,
    SalesIntelligenceService,
    ExportIntelligenceService,
    FinancingIntelligenceService,
    InsuranceIntelligenceService,
    NotificationIntelligenceService,
    EnterpriseWorkflowService,
    AiDecisionFlowService,
  ],
  exports: [
    BuyerIntelligenceService,
    DealerIntelligenceService,
    RecommendationIntelligenceService,
    InspectionWorkflowService,
    SmartRulesEngineService,
    LeadIntelligenceService,
    MarketplaceRankingService,
    TrustIntelligenceService,
    SalesIntelligenceService,
    ExportIntelligenceService,
    FinancingIntelligenceService,
    InsuranceIntelligenceService,
    NotificationIntelligenceService,
    EnterpriseWorkflowService,
    AiDecisionFlowService,
  ],
})
export class VehicleUltraIntelligenceModule {}
