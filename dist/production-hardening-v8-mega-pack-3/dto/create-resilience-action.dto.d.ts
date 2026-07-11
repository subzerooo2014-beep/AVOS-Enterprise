import { ResilienceActionType } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";
export declare class CreateResilienceActionDto {
    incidentId?: string;
    configurationId?: string;
    type: ResilienceActionType;
    name: string;
    description?: string;
    target: string;
    parameters: Record<string, unknown>;
    requiresApproval?: boolean;
    idempotencyKey?: string;
    dryRun?: boolean;
    actor: RuntimeActorDto;
}
