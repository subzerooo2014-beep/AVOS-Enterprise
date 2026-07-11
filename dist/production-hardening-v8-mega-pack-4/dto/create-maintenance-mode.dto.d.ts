import { GovernanceEnvironment } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateMaintenanceModeDto {
    key: string;
    name: string;
    description?: string;
    environment: GovernanceEnvironment;
    namespace: string;
    startsAt: string;
    endsAt?: string;
    affectedServices: string[];
    allowReadOperations: boolean;
    allowWriteOperations: boolean;
    allowBackgroundJobs: boolean;
    allowDeployments: boolean;
    publicMessage?: string;
    internalMessage?: string;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
