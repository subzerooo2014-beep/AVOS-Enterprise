import { Module } from "@nestjs/common";
import { UltraAiCommerceController } from "./ultra-ai-commerce.controller";
import { UltraAiCommerceService } from "./ultra-ai-commerce.service";
import { BatchIntelligenceEngine } from "./engines/batch-intelligence.engine";
import { BuyerMatchingEngine } from "./engines/buyer-matching.engine";
import { DecisionOrchestratorEngine } from "./engines/decision-orchestrator.engine";
import { DynamicPricingEngine } from "./engines/dynamic-pricing.engine";
import { ExportIntelligenceEngine } from "./engines/export-intelligence.engine";
import { FeedbackLearningEngine } from "./engines/feedback-learning.engine";
import { FinanceIntelligenceEngine } from "./engines/finance-intelligence.engine";
import { FraudRiskEngine } from "./engines/fraud-risk.engine";
import { InspectionIntelligenceEngine } from "./engines/inspection-intelligence.engine";
import { InsuranceIntelligenceEngine } from "./engines/insurance-intelligence.engine";
import { MarketIntelligenceEngine } from "./engines/market-intelligence.engine";
import { MarketSignalEngine } from "./engines/market-signal.engine";
import { NegotiationAiEngine } from "./engines/negotiation-ai.engine";
import { RecommendationEngine } from "./engines/recommendation.engine";
import { SellerAssistantEngine } from "./engines/seller-assistant.engine";
import { VehicleHealthEngine } from "./engines/vehicle-health.engine";

@Module({
  controllers: [UltraAiCommerceController],
  providers: [
    UltraAiCommerceService,
    DynamicPricingEngine,
    NegotiationAiEngine,
    BuyerMatchingEngine,
    FraudRiskEngine,
    MarketIntelligenceEngine,
    SellerAssistantEngine,
    VehicleHealthEngine,
    InspectionIntelligenceEngine,
    FinanceIntelligenceEngine,
    InsuranceIntelligenceEngine,
    ExportIntelligenceEngine,
    RecommendationEngine,
    DecisionOrchestratorEngine,
    FeedbackLearningEngine,
    BatchIntelligenceEngine,
    MarketSignalEngine,
  ],
  exports: [UltraAiCommerceService],
})
export class UltraAiCommerceModule {}
