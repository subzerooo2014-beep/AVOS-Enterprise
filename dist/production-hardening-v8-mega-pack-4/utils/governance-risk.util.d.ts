import { CascadingFailureRisk, GovernanceDecision, GovernanceRiskLevel } from "../contracts";
export declare function clampGovernanceScore(score: number): number;
export declare function governanceRiskFromScore(score: number): GovernanceRiskLevel;
export declare function governanceDecisionFromRisk(riskLevel: GovernanceRiskLevel): GovernanceDecision;
export declare function approvalsFromGovernanceRisk(riskLevel: GovernanceRiskLevel): number;
export declare function cascadeRiskFromScore(score: number): CascadingFailureRisk;
