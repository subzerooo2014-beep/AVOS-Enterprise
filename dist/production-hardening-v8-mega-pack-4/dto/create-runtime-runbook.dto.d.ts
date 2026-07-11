import { GovernanceEnvironment, GovernanceRequestType, GovernanceRiskLevel, RuntimeRunbookStepType } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateRuntimeRunbookStepDto {
    id: string;
    name: string;
    description?: string;
    type: RuntimeRunbookStepType;
    order: number;
    required: boolean;
    timeoutSeconds: number;
    retryLimit: number;
    continueOnFailure: boolean;
    condition?: Record<string, unknown>;
    parameters: Record<string, unknown>;
    rollbackStepType?: RuntimeRunbookStepType;
    rollbackParameters?: Record<string, unknown>;
}
export declare class CreateRuntimeRunbookDto {
    key: string;
    name: string;
    description?: string;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    requestTypes: GovernanceRequestType[];
    minimumRiskLevel: GovernanceRiskLevel;
    maximumRiskLevel: GovernanceRiskLevel;
    requiresApproval: boolean;
    requiredRoles: string[];
    steps: CreateRuntimeRunbookStepDto[];
    tags?: string[];
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
