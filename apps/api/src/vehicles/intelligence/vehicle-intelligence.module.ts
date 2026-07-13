import { Module } from "@nestjs/common";
import { VehicleEnterpriseOrchestratorService } from "./vehicle-enterprise-orchestrator.service";
import { VehicleFraudModule } from "./vehicle-fraud.module";
import { VehicleInspectionIntelligenceService } from "./vehicle-inspection-intelligence.service";
import { VehicleMarketAnalysisService } from "./vehicle-market-analysis.service";
import { VehiclePricingModule } from "./vehicle-pricing.module";

@Module({
  imports: [VehicleFraudModule, VehiclePricingModule],
  providers: [
    VehicleEnterpriseOrchestratorService,
    VehicleMarketAnalysisService,
    VehicleInspectionIntelligenceService,
  ],
  exports: [
    VehicleEnterpriseOrchestratorService,
    VehicleMarketAnalysisService,
    VehicleInspectionIntelligenceService,
  ],
})
export class VehicleIntelligenceModule {}
