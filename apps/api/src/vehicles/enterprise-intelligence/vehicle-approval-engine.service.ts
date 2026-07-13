import { Injectable } from "@nestjs/common";
import {
  VehicleApprovalContext,
  VehicleApprovalResult,
} from "./vehicle-approval.types";

@Injectable()
export class VehicleApprovalEngineService {
  evaluate(context: VehicleApprovalContext): VehicleApprovalResult {
    const fraudPenalty =
      context.fraudRisk === "HIGH"
        ? 60
        : context.fraudRisk === "MEDIUM"
          ? 25
          : 0;

    const eligibilityBonus =
      (context.financeEligible ? 8 : 0) +
      (context.insuranceEligible ? 8 : 0);

    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          context.qualityScore * 0.35 +
            context.marketDemand * 0.2 +
            context.inspectionScore * 0.29 +
            eligibilityBonus -
            fraudPenalty,
        ),
      ),
    );

    const reasons: string[] = [];
    const nextActions: string[] = [];

    if (context.fraudRisk === "HIGH") {
      reasons.push("high-fraud-risk");
      nextActions.push("fraud-investigation");
      return {
        decision: "REJECT",
        score,
        confidence: 98,
        reasons,
        nextActions,
      };
    }

    if (
      score >= 85 &&
      context.financeEligible &&
      context.insuranceEligible
    ) {
      reasons.push("enterprise-approval-threshold-met");
      nextActions.push("publish", "notify-marketplace");
      return {
        decision: "AUTO_APPROVE",
        score,
        confidence: 94,
        reasons,
        nextActions,
      };
    }

    if (score >= 60) {
      reasons.push("manual-review-required");
      nextActions.push("manual-review", "request-missing-evidence");
      return {
        decision: "MANUAL_REVIEW",
        score,
        confidence: 82,
        reasons,
        nextActions,
      };
    }

    reasons.push("approval-score-below-threshold");
    nextActions.push("improve-listing-quality");
    return {
      decision: "REJECT",
      score,
      confidence: 90,
      reasons,
      nextActions,
    };
  }
}
