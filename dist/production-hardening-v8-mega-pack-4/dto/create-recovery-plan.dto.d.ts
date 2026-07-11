import { GovernanceEnvironment, GovernanceRiskLevel, RecoveryActionType } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateRecoveryActionDto {
    type: RecoveryActionType;
    name: string;
    description?: string;
    target: string;
    order: number;
    required: boolean;
    timeoutSeconds: number;
    retryLimit: number;
    parameters: Record<string, unknown>;
    rollbackActionType?: RecoveryActionType;
    rollbackParameters?: Record<string, unknown>;
}
export declare class CreateRecoveryPlanDto {
    key: string;
    name: string;
    description?: string;
    environment: GovernanceEnvironment;
    namespace: string;
    service?: string;
    sourceNodeId?: string;
    cascadeAnalysisId?: string;
    governanceRequestId?: string;
    riskLevel: GovernanceRiskLevel;
    requiresApproval?: boolean;
    approvalsRequired?: number;
    actions: CreateRecoveryActionDto[];
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
