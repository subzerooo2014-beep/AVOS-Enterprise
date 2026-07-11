import { RuntimeChangeType, RuntimeControlMode, RuntimeEnvironment } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";
export declare class CreateResilienceConfigurationDto {
    key: string;
    name: string;
    description?: string;
    environment: RuntimeEnvironment;
    namespace: string;
    controlMode: RuntimeControlMode;
    changeType: RuntimeChangeType;
    payload: Record<string, unknown>;
    tags?: string[];
    requiresApproval?: boolean;
    minimumApprovals?: number;
    actor: RuntimeActorDto;
}
