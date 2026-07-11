import { PolicyDecision } from "../enums/policy-decision.enum";
import { RiskLevel } from "../enums/risk-level.enum";
export interface PolicyEvaluation {
    decision: PolicyDecision;
    riskLevel: RiskLevel;
    riskScore: number;
    matchedPolicyIds: string[];
    reasons: string[];
    approvalRequired: boolean;
    evaluatedAt: string;
}
