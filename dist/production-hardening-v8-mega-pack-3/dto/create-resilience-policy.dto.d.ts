import { ResilienceActionType, RuntimeDecision, RuntimeEnvironment, RuntimeRiskLevel } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";
export declare const RESILIENCE_POLICY_OPERATORS: readonly ["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"];
export type ResiliencePolicyOperator = (typeof RESILIENCE_POLICY_OPERATORS)[number];
export declare class ResiliencePolicyConditionDto {
    field: string;
    operator: ResiliencePolicyOperator;
    value?: unknown;
}
export declare class ResiliencePolicyRuleDto {
    id: string;
    name: string;
    description?: string;
    priority: number;
    enabled: boolean;
    conditions: ResiliencePolicyConditionDto[];
    decision: RuntimeDecision;
    riskLevel: RuntimeRiskLevel;
    requiredApprovals?: number;
    actionTypes?: ResilienceActionType[];
    metadata?: Record<string, unknown>;
}
export declare class CreateResiliencePolicyDto {
    key: string;
    name: string;
    description?: string;
    environment?: RuntimeEnvironment;
    namespace?: string;
    rules: ResiliencePolicyRuleDto[];
    defaultDecision: RuntimeDecision;
    defaultRiskLevel: RuntimeRiskLevel;
    actor: RuntimeActorDto;
}
