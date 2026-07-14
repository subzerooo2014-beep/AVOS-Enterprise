import { Injectable } from "@nestjs/common";
import { EnterpriseDecision } from "./enterprise-e8.types";

@Injectable()
export class EnterprisePolicyGuardService {
  evaluate(decision: EnterpriseDecision) {
    const allowedActions = new Set([
      "activate-enterprise-containment",
      "activate-preventive-mitigation",
      "optimize-enterprise-runtime",
    ]);

    const allowed =
      allowedActions.has(decision.action) &&
      decision.confidence >= 60 &&
      decision.status !== "BLOCKED";

    return {
      decisionId: decision.id,
      policyAllowed: allowed,
      policy: "enterprise-autonomy-e8",
      reason: allowed
        ? "Decision satisfies confidence and action governance."
        : "Decision was blocked by enterprise governance.",
      evaluatedAt: new Date().toISOString(),
    };
  }
}