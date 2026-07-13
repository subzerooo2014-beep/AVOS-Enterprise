import { Injectable } from "@nestjs/common";

@Injectable()
export class FraudCaseOrchestratorService {
  orchestrate(input: {
    fraudRisk: "LOW" | "MEDIUM" | "HIGH";
    evidenceCount: number;
    identityVerified: boolean;
  }) {
    if (input.fraudRisk === "HIGH") {
      return {
        status: "ESCALATED",
        actions: ["freeze-listing", "open-case", "notify-risk-team"],
      };
    }

    if (input.fraudRisk === "MEDIUM" || !input.identityVerified) {
      return {
        status: "REVIEW",
        actions: ["request-evidence", "manual-review"],
      };
    }

    return {
      status: "CLEARED",
      actions: ["continue-processing"],
    };
  }
}
