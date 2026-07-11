import { RuntimeChangeType, RuntimeEnvironment } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";
export declare class EvaluateRuntimeRiskDto {
    configurationId?: string;
    policyId?: string;
    environment: RuntimeEnvironment;
    namespace: string;
    changeType: RuntimeChangeType;
    context: Record<string, unknown>;
    actor: RuntimeActorDto;
}
