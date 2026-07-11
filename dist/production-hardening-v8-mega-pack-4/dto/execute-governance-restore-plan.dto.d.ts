import { GovernanceActorDto } from "./governance-actor.dto";
export declare class ExecuteGovernanceRestorePlanDto {
    confirmExecution?: boolean;
    runtimeContext?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
