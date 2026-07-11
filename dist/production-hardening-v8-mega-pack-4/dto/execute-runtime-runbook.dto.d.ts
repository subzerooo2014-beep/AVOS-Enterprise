import { GovernanceActorDto } from "./governance-actor.dto";
export declare class ExecuteRuntimeRunbookDto {
    governanceRequestId?: string;
    decisionRecordId?: string;
    changeExecutionId?: string;
    dryRun?: boolean;
    runtimeContext?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
