import { GovernanceEscalationStatus } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class UpdateGovernanceEscalationDto {
    status: GovernanceEscalationStatus;
    reason: string;
    resolution?: string;
    actor: GovernanceActorDto;
}
