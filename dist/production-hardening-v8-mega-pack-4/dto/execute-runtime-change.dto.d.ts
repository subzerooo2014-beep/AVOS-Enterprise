import { GovernanceActorDto } from "./governance-actor.dto";
export declare class ExecuteRuntimeChangeDto {
    runtimeContext?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
