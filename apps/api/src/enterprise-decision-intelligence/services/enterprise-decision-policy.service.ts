import { Injectable } from "@nestjs/common";
import { DecisionOption, DecisionPolicyResult } from "../contracts/enterprise-decision-intelligence.contracts";

@Injectable()
export class EnterpriseDecisionPolicyService {
  evaluate(options: DecisionOption[], context: Record<string, unknown>): DecisionPolicyResult {
    const reasons: string[] = [];
    const appliedPolicies = ["decision.options.required", "decision.risk.maximum", "decision.confidence.minimum"];
    if (options.length === 0) reasons.push("At least one decision option is required.");
    const blockedOptions = options.filter(option => option.risk >= 95 || option.confidence <= 5);
    if (blockedOptions.length > 0) reasons.push(`${blockedOptions.length} option(s) violate risk or confidence limits.`);
    if (context["blocked"] === true) reasons.push("Decision context is explicitly blocked.");
    return { allowed: options.length > 0 && blockedOptions.length !== options.length && context["blocked"] !== true, reasons, appliedPolicies };
  }
}