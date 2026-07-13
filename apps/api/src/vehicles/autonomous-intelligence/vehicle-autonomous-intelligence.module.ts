import { Module } from "@nestjs/common";
import { VehicleDemandForecastService } from "./vehicle-demand-forecast.service";
import { DynamicPricingOrchestratorService } from "./dynamic-pricing-orchestrator.service";
import { InventoryOptimizationService } from "./inventory-optimization.service";
import { BuyerConversionIntelligenceService } from "./buyer-conversion-intelligence.service";
import { SellerSuccessIntelligenceService } from "./seller-success-intelligence.service";
import { FraudCaseOrchestratorService } from "./fraud-case-orchestrator.service";
import { VehicleComplianceIntelligenceService } from "./vehicle-compliance-intelligence.service";
import { ExportRouteIntelligenceService } from "./export-route-intelligence.service";
import { LogisticsIntelligenceService } from "./logistics-intelligence.service";
import { AuctionIntelligenceService } from "./auction-intelligence.service";
import { TradeInIntelligenceService } from "./trade-in-intelligence.service";
import { WarrantyIntelligenceService } from "./warranty-intelligence.service";
import { ServiceNetworkIntelligenceService } from "./service-network-intelligence.service";
import { PartnerIntelligenceService } from "./partner-intelligence.service";
import { CustomerJourneyIntelligenceService } from "./customer-journey-intelligence.service";
import { RetentionIntelligenceService } from "./retention-intelligence.service";
import { RevenueOptimizationService } from "./revenue-optimization.service";
import { AutonomousCampaignIntelligenceService } from "./autonomous-campaign-intelligence.service";
import { EcosystemCoordinationService } from "./ecosystem-coordination.service";
import { AutonomousVehicleDecisionService } from "./autonomous-vehicle-decision.service";

@Module({
  providers: [
    VehicleDemandForecastService,
    DynamicPricingOrchestratorService,
    InventoryOptimizationService,
    BuyerConversionIntelligenceService,
    SellerSuccessIntelligenceService,
    FraudCaseOrchestratorService,
    VehicleComplianceIntelligenceService,
    ExportRouteIntelligenceService,
    LogisticsIntelligenceService,
    AuctionIntelligenceService,
    TradeInIntelligenceService,
    WarrantyIntelligenceService,
    ServiceNetworkIntelligenceService,
    PartnerIntelligenceService,
    CustomerJourneyIntelligenceService,
    RetentionIntelligenceService,
    RevenueOptimizationService,
    AutonomousCampaignIntelligenceService,
    EcosystemCoordinationService,
    AutonomousVehicleDecisionService,
  ],
  exports: [
    VehicleDemandForecastService,
    DynamicPricingOrchestratorService,
    InventoryOptimizationService,
    BuyerConversionIntelligenceService,
    SellerSuccessIntelligenceService,
    FraudCaseOrchestratorService,
    VehicleComplianceIntelligenceService,
    ExportRouteIntelligenceService,
    LogisticsIntelligenceService,
    AuctionIntelligenceService,
    TradeInIntelligenceService,
    WarrantyIntelligenceService,
    ServiceNetworkIntelligenceService,
    PartnerIntelligenceService,
    CustomerJourneyIntelligenceService,
    RetentionIntelligenceService,
    RevenueOptimizationService,
    AutonomousCampaignIntelligenceService,
    EcosystemCoordinationService,
    AutonomousVehicleDecisionService,
  ],
})
export class VehicleAutonomousIntelligenceModule {}
