import { GovernanceEnvironment, GovernanceScheduleType } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateGovernanceScheduleDto {
    key: string;
    name: string;
    description?: string;
    type: GovernanceScheduleType;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    targetId?: string;
    runAt?: string;
    intervalSeconds?: number;
    maximumRuns?: number;
    retryLimit?: number;
    retryDelaySeconds?: number;
    enabled?: boolean;
    expiresAt?: string;
    payload?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
