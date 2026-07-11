import { RuntimeDecision, RuntimeRiskLevel } from "../contracts/runtime-resilience.enums";
export declare function clampScore(score: number): number;
export declare function riskLevelFromScore(score: number): RuntimeRiskLevel;
export declare function decisionFromRiskLevel(riskLevel: RuntimeRiskLevel): RuntimeDecision;
export declare function requiredApprovalsFromRiskLevel(riskLevel: RuntimeRiskLevel): number;
