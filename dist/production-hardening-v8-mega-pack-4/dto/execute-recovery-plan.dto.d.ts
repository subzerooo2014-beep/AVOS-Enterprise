import { GovernanceActorDto } from "./governance-actor.dto";
export declare class ExecuteRecoveryPlanDto {
    dryRun?: boolean;
    runtimeContext?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
