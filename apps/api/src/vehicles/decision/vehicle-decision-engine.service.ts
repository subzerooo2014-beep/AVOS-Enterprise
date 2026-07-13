import { Injectable } from "@nestjs/common";

import { VehicleDecision } from "./vehicle-decision.types";
import { VehicleReadinessService } from "./vehicle-readiness.service";
import { VehicleFinanceEligibilityService } from "./vehicle-finance-eligibility.service";
import { VehicleInsuranceEligibilityService } from "./vehicle-insurance-eligibility.service";
import { VehicleMarketplaceScoreService } from "./vehicle-marketplace-score.service";

@Injectable()
export class VehicleDecisionEngineService {

  constructor(
    private readonly readiness: VehicleReadinessService,
    private readonly finance: VehicleFinanceEligibilityService,
    private readonly insurance: VehicleInsuranceEligibilityService,
    private readonly marketplace: VehicleMarketplaceScoreService,
  ) {}

  evaluate(vehicle: any) {

    const readiness =
      this.readiness.evaluate(vehicle);

    const finance =
      this.finance.evaluate(
        readiness.qualityScore,
      );

    const insurance =
      this.insurance.evaluate(
        readiness.qualityScore,
      );

    const marketplaceScore =
      this.marketplace.calculate(
        readiness.qualityScore,
        finance.eligible,
        insurance.eligible,
      );

    let decision: VehicleDecision =
      "REJECT";

    let confidence = 95;

    let priority:
      | "low"
      | "normal"
      | "high" = "low";

    if (marketplaceScore >= 90) {
      decision = "AUTO_APPROVE";
      confidence = 98;
      priority = "high";
    } else if (marketplaceScore >= 70) {
      decision = "MANUAL_REVIEW";
      confidence = 82;
      priority = "normal";
    }

    return {
      ...readiness,
      financeEligible: finance.eligible,
      insuranceEligible: insurance.eligible,
      marketplaceEligible:
        finance.eligible &&
        insurance.eligible &&
        readiness.inspectionReady,
      publishingAllowed:
        finance.eligible &&
        insurance.eligible &&
        readiness.inspectionReady,
      marketplaceScore,
      decision,
      confidence,
      priority,
      nextActions:
        decision === "AUTO_APPROVE"
          ? [
              "publish",
              "notify-marketplace",
              "notify-dealer",
            ]
          : decision === "MANUAL_REVIEW"
            ? [
                "manual-review",
                "inspection",
              ]
            : [
                "complete-missing-data",
              ],
    };

  }

}
