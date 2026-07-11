import { GovernanceEnvironment, GovernanceEscalationReason, GovernanceEscalationSeverity } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateGovernanceEscalationDto {
    severity: GovernanceEscalationSeverity;
    reason: GovernanceEscalationReason;
    title: string;
    description: string;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    governanceRequestId?: string;
    decisionRecordId?: string;
    changeExecutionId?: string;
    runbookExecutionId?: string;
    recoveryPlanId?: string;
    isolationPlanId?: string;
    dependencyNodeId?: string;
    sloEvaluationId?: string;
    capacityEvaluationId?: string;
    assignedRoles: string[];
    assignedActors?: GovernanceActorDto[];
    acknowledgementRequired: boolean;
    expiresAt?: string;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
