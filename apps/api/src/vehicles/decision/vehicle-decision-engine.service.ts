import { Injectable } from "@nestjs/common";

import { VehicleDecision } from "./vehicle-decision.types";
import { VehicleReadinessService } from "./vehicle-readiness.service";
import { VehicleFinanceEligibilityService } from "./vehicle-finance-eligibility.service";
import { VehicleInsuranceEligibilityService } from "./vehicle-insurance-eligibility.service";
import { VehicleMarketplaceScoreService } from "./vehicle-marketplace-score.service";
import { VehicleIntelligenceDecisionService } from "./vehicle-intelligence-decision.service";

@Injectable()
export class VehicleDecisionEngineService {

  constructor(
    private readonly readiness: VehicleReadinessService,
    private readonly finance: VehicleFinanceEligibilityService,
    private readonly insurance: VehicleInsuranceEligibilityService,
    private readonly marketplace: VehicleMarketplaceScoreService,
    private readonly intelligenceDecision: VehicleIntelligenceDecisionService,
  ) {}

  evaluate(vehicle: any) {

    const readiness =
      this.readiness.evaluate(vehicle);

    const intelligenceSignal =
      this.intelligenceDecision.evaluate(
        vehicle,
        readiness.qualityScore,
      );

    const decisionQualityScore =
      intelligenceSignal.adjustedQualityScore;

    const finance =
      this.finance.evaluate(
        decisionQualityScore,
      );

    const insurance =
      this.insurance.evaluate(
        decisionQualityScore,
      );

    const marketplaceScore =
      this.marketplace.calculate(
        decisionQualityScore,
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

    if (intelligenceSignal.blocksPublishing) {
      decision = "REJECT";
      confidence = intelligenceSignal.intelligence.confidence;
      priority = "high";
    } else if (intelligenceSignal.requiresManualReview) {
      decision = "MANUAL_REVIEW";
      confidence = intelligenceSignal.intelligence.confidence;
      priority = "high";
    } else if (marketplaceScore >= 90) {
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
      qualityScore: decisionQualityScore,
      intelligenceRisk: intelligenceSignal.intelligence.risk,
      intelligenceConfidence: intelligenceSignal.intelligence.confidence,
      financeEligible: finance.eligible,
      insuranceEligible: insurance.eligible,
      marketplaceEligible:
        finance.eligible &&
        insurance.eligible &&
        readiness.inspectionReady &&
        !intelligenceSignal.blocksPublishing,
      publishingAllowed:
        finance.eligible &&
        insurance.eligible &&
        readiness.inspectionReady &&
        !intelligenceSignal.blocksPublishing,
      marketplaceScore,
      reasons: [
        ...readiness.reasons,
        ...intelligenceSignal.reasons,
      ],
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
