import { Module } from "@nestjs/common";
import { VehicleDemandForecastService } from "./vehicle-demand-forecast.service";
import { VehiclePriceOptimizationService } from "./vehicle-price-optimization.service";
import { VehicleTrustOrchestrationService } from "./vehicle-trust-orchestration.service";
import { VehicleExportReadinessService } from "./vehicle-export-readiness.service";
import { VehicleLogisticsPlanningService } from "./vehicle-logistics-planning.service";
import { VehicleAuctionIntelligenceService } from "./vehicle-auction-intelligence.service";
import { VehicleRetentionIntelligenceService } from "./vehicle-retention-intelligence.service";
import { VehicleGrowthIntelligenceService } from "./vehicle-growth-intelligence.service";
import { VehiclePartnerNetworkService } from "./vehicle-partner-network.service";
import { VehicleRegulationIntelligenceService } from "./vehicle-regulation-intelligence.service";

@Module({
  providers: [
    VehicleDemandForecastService,
    VehiclePriceOptimizationService,
    VehicleTrustOrchestrationService,
    VehicleExportReadinessService,
    VehicleLogisticsPlanningService,
    VehicleAuctionIntelligenceService,
    VehicleRetentionIntelligenceService,
    VehicleGrowthIntelligenceService,
    VehiclePartnerNetworkService,
    VehicleRegulationIntelligenceService,
  ],
  exports: [
    VehicleDemandForecastService,
    VehiclePriceOptimizationService,
    VehicleTrustOrchestrationService,
    VehicleExportReadinessService,
    VehicleLogisticsPlanningService,
    VehicleAuctionIntelligenceService,
    VehicleRetentionIntelligenceService,
    VehicleGrowthIntelligenceService,
    VehiclePartnerNetworkService,
    VehicleRegulationIntelligenceService,
  ],
})
export class VehicleAutonomousPlatformModule {}
