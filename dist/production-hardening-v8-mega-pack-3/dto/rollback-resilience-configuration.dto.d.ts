import { RuntimeActorDto } from "./runtime-actor.dto";
export declare class RollbackResilienceConfigurationDto {
    reason: string;
    targetConfigurationId?: string;
    baselineId?: string;
    actor: RuntimeActorDto;
}
