import { GovernanceActorDto } from "./governance-actor.dto";
export declare class SimulateGovernanceRequestDto {
    scenarioName: string;
    description?: string;
    changes: Record<string, unknown>;
    assumptions?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
