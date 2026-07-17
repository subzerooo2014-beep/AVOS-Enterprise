import { Injectable } from "@nestjs/common";
import { DecisionOption, DecisionRuleResult } from "../contracts/enterprise-decision-intelligence.contracts";

@Injectable()
export class EnterpriseDecisionRuleService {
  evaluate(options: DecisionOption[], context: Record<string, unknown>): DecisionRuleResult {
    const matchedRules: string[] = [];
    const reasons: string[] = [];
    let scoreAdjustment = 0;
    if (options.some(option => option.confidence >= 80)) { matchedRules.push("high-confidence-option"); reasons.push("At least one option has high confidence."); scoreAdjustment += 5; }
    if (options.some(option => option.risk >= 75)) { matchedRules.push("high-risk-option"); reasons.push("At least one option has elevated risk."); scoreAdjustment -= 10; }
    if (context["priority"] === "critical") { matchedRules.push("critical-priority"); reasons.push("Critical priority increases decision urgency."); scoreAdjustment += 3; }
    return { matchedRules, scoreAdjustment, reasons };
  }
}