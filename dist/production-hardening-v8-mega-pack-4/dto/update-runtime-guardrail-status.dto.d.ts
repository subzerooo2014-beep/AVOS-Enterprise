import { GuardrailStatus } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class UpdateRuntimeGuardrailStatusDto {
    status: GuardrailStatus;
    reason: string;
    actor: GovernanceActorDto;
}
