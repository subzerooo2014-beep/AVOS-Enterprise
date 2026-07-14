import { Injectable } from "@nestjs/common";
import { EnterpriseValueOpportunity } from "./enterprise-e10.types";

@Injectable()
export class EnterpriseValueGovernanceService {
  evaluate(opportunity: EnterpriseValueOpportunity) {
    const approved =
      opportunity.expectedValue > 0 &&
      opportunity.confidence >= 60 &&
      opportunity.riskScore <= 70;

    return {
      opportunityId: opportunity.id,
      approved,
      policy: "enterprise-value-governance-e10",
      reason: approved
        ? "Opportunity satisfies value, confidence, and risk controls."
        : "Opportunity was blocked by enterprise value governance.",
      evaluatedAt: new Date().toISOString(),
    };
  }
}