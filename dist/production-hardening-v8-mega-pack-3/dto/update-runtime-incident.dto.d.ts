import { RuntimeIncidentStatus } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";
export declare class UpdateRuntimeIncidentDto {
    status: RuntimeIncidentStatus;
    message: string;
    metadata?: Record<string, unknown>;
    actor: RuntimeActorDto;
}
