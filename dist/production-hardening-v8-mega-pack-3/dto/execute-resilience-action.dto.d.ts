import { RuntimeActorDto } from "./runtime-actor.dto";
export declare class ExecuteResilienceActionDto {
    approved?: boolean;
    runtimeContext?: Record<string, unknown>;
    actor: RuntimeActorDto;
}
