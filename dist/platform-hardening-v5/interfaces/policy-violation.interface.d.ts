import { PolicyDecision } from "../enums/policy-decision.enum";
import { RiskLevel } from "../enums/risk-level.enum";
export interface PolicyViolation {
    id: string;
    policyIds: string[];
    method: string;
    path: string;
    decision: PolicyDecision;
    riskLevel: RiskLevel;
    riskScore: number;
    reasons: string[];
    correlationId?: string;
    traceId?: string;
    actor?: string;
    createdAt: string;
}
