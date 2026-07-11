import { ApprovalDecision } from "../contracts/runtime-resilience.enums";
import { RuntimeActorDto } from "./runtime-actor.dto";
export declare class ApproveResilienceConfigurationDto {
    decision: ApprovalDecision;
    reason: string;
    actor: RuntimeActorDto;
}
