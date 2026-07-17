import { Injectable } from "@nestjs/common";
import { EnterpriseDecisionRecord } from "../contracts/advanced-intelligence.contracts";

@Injectable()
export class DecisionGovernanceService {
  evaluate(decision: EnterpriseDecisionRecord): Record<string, unknown> {
    const checks = {
      decisionIdPresent: decision.id.length > 0,
      objectivePresent: decision.objective.length > 0,
      optionSelected: decision.selectedOption.length > 0,
      confidenceValid:
        decision.confidence >= 0 && decision.confidence <= 1,
      rationalePresent: decision.rationale.length > 0,
      humanAuthorityEvaluated:
        typeof decision.requiresHumanApproval === "boolean",
    };

    return {
      status: Object.values(checks).every(Boolean) ? "approved" : "rejected",
      checks,
      governedAt: new Date().toISOString(),
    };
  }
}