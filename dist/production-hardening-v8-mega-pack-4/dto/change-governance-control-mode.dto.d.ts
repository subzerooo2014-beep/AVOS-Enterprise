import { GovernanceControlMode } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class ChangeGovernanceControlModeDto {
    controlMode: GovernanceControlMode;
    reason: string;
    actor: GovernanceActorDto;
}
