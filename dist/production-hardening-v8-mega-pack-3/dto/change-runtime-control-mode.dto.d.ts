import { RuntimeControlMode } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";
export declare class ChangeRuntimeControlModeDto {
    controlMode: RuntimeControlMode;
    reason: string;
    actor: RuntimeActorDto;
}
