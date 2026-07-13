import { Injectable } from "@nestjs/common";
import {
  VehicleEnterpriseDecisionInput,
  VehicleEnterpriseDecisionResult,
} from "./vehicle-enterprise-decision.types";

@Injectable()
export class VehicleEnterpriseDecisionCoordinatorService {
  coordinate(
    input: VehicleEnterpriseDecisionInput,
  ): VehicleEnterpriseDecisionResult {
    if (input.fraudRisk === "HIGH") {
      return {
        decision: "BLOCK",
        confidence: 99,
        priority: "HIGH",
        actions: ["block-publication", "open-fraud-case"],
      };
    }

    if (
      input.approvalScore >= 85 &&
      input.marketplaceScore >= 75 &&
      input.financeEligible &&
      input.insuranceEligible
    ) {
      return {
        decision: "PUBLISH",
        confidence: 95,
        priority: "HIGH",
        actions: [
          "publish-listing",
          "activate-marketplace-ranking",
          "notify-qualified-buyers",
        ],
      };
    }

    return {
      decision: "REVIEW",
      confidence: 84,
      priority: "NORMAL",
      actions: [
        "manual-review",
        "request-additional-evidence",
      ],
    };
  }
}
