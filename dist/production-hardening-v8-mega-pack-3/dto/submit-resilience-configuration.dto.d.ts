import { RuntimeActorDto } from "./runtime-actor.dto";
export declare class SubmitResilienceConfigurationDto {
    reason?: string;
    context?: Record<string, unknown>;
    actor: RuntimeActorDto;
}
