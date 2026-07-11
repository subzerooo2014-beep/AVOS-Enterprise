import { GovernanceEnvironment, RuntimeLockType } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class AcquireRuntimeLockDto {
    key: string;
    type: RuntimeLockType;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    resourceId?: string;
    changeExecutionId?: string;
    ttlSeconds: number;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
