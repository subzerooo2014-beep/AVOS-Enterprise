import { Module } from "@nestjs/common";
import { VehicleApprovalEngineService } from "./vehicle-approval-engine.service";
import { VehicleMarketplaceIntelligenceService } from "./vehicle-marketplace-intelligence.service";
import { VehicleFinanceInsuranceIntelligenceService } from "./vehicle-finance-insurance-intelligence.service";
import { VehicleEnterpriseDecisionCoordinatorService } from "./vehicle-enterprise-decision-coordinator.service";

@Module({
  providers: [
    VehicleApprovalEngineService,
    VehicleMarketplaceIntelligenceService,
    VehicleFinanceInsuranceIntelligenceService,
    VehicleEnterpriseDecisionCoordinatorService,
  ],
  exports: [
    VehicleApprovalEngineService,
    VehicleMarketplaceIntelligenceService,
    VehicleFinanceInsuranceIntelligenceService,
    VehicleEnterpriseDecisionCoordinatorService,
  ],
})
export class VehicleEnterpriseIntelligenceModule {}
