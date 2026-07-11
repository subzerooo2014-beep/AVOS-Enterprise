import { GovernanceCheckpointType, GovernanceEnvironment, GovernanceSnapshotScope } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateGovernanceCheckpointDto {
    key: string;
    name: string;
    description?: string;
    type: GovernanceCheckpointType;
    scope: GovernanceSnapshotScope;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    governanceRequestId?: string;
    changeExecutionId?: string;
    recoveryPlanId?: string;
    previousCheckpointId?: string;
    expiresAt?: string;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
