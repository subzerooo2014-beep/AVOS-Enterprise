import { GovernanceDecision, GovernanceEnvironment, GovernanceRequestType, GuardrailType } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare const RUNTIME_GUARDRAIL_OPERATORS: readonly ["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "exists", "contains"];
export type RuntimeGuardrailOperator = (typeof RUNTIME_GUARDRAIL_OPERATORS)[number];
export declare class RuntimeGuardrailConditionDto {
    field: string;
    operator: RuntimeGuardrailOperator;
    value?: unknown;
}
export declare class CreateRuntimeGuardrailDto {
    key: string;
    name: string;
    description?: string;
    type: GuardrailType;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    requestTypes: GovernanceRequestType[];
    conditions: RuntimeGuardrailConditionDto[];
    failureDecision: GovernanceDecision;
    warningOnly: boolean;
    priority: number;
    requiredRoles: string[];
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
