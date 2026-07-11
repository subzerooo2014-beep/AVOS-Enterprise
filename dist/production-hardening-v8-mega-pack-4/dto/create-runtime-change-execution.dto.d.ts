import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateRuntimeChangeExecutionDto {
    governanceRequestId: string;
    decisionRecordId?: string;
    recoveryPlanId?: string;
    isolationPlanId?: string;
    dryRun?: boolean;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
