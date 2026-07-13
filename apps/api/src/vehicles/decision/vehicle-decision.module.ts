import { Module } from "@nestjs/common";
import { VehicleIntelligenceModule } from "../intelligence/vehicle-intelligence.module";

import { VehicleDecisionEngineService } from "./vehicle-decision-engine.service";
import { VehicleReadinessService } from "./vehicle-readiness.service";
import { VehicleMarketplaceScoreService } from "./vehicle-marketplace-score.service";
import { VehicleFinanceEligibilityService } from "./vehicle-finance-eligibility.service";
import { VehicleInsuranceEligibilityService } from "./vehicle-insurance-eligibility.service";
import { VehicleIntelligenceDecisionService } from "./vehicle-intelligence-decision.service";

@Module({
  imports: [VehicleIntelligenceModule],
  providers: [
    VehicleDecisionEngineService,
    VehicleReadinessService,
    VehicleMarketplaceScoreService,
    VehicleFinanceEligibilityService,
    VehicleInsuranceEligibilityService,
    VehicleIntelligenceDecisionService,
  ],
  exports: [
    VehicleDecisionEngineService,
  ],
})
export class VehicleDecisionModule {}
