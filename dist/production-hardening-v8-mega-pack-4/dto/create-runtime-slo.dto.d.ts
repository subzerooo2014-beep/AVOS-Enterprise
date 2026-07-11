import { GovernanceEnvironment } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateRuntimeSloDto {
    key: string;
    name: string;
    description?: string;
    environment: GovernanceEnvironment;
    namespace: string;
    service: string;
    metric: string;
    target: number;
    warningThreshold: number;
    breachThreshold: number;
    evaluationWindowMinutes: number;
    enabled: boolean;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
