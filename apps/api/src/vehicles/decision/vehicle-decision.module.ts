import { Module } from "@nestjs/common";

import { VehicleDecisionEngineService } from "./vehicle-decision-engine.service";
import { VehicleReadinessService } from "./vehicle-readiness.service";
import { VehicleMarketplaceScoreService } from "./vehicle-marketplace-score.service";
import { VehicleFinanceEligibilityService } from "./vehicle-finance-eligibility.service";
import { VehicleInsuranceEligibilityService } from "./vehicle-insurance-eligibility.service";

@Module({
  providers: [
    VehicleDecisionEngineService,
    VehicleReadinessService,
    VehicleMarketplaceScoreService,
    VehicleFinanceEligibilityService,
    VehicleInsuranceEligibilityService,
  ],
  exports: [
    VehicleDecisionEngineService,
  ],
})
export class VehicleDecisionModule {}
