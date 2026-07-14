import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernancePolicy {
  evaluate(input: { riskScore: number; confidence: number; requiresHumanApproval?: boolean }) {
    if (input.requiresHumanApproval) return { decision: "ESCALATE", reason: "human_approval_required" };
    if (input.riskScore >= 70) return { decision: "DENY", reason: "high_risk" };
    if (input.riskScore >= 40 || input.confidence < 65) return { decision: "REVIEW", reason: "review_required" };
    return { decision: "ALLOW", reason: "policy_passed" };
  }
}
