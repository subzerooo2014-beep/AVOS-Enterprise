import { GovernanceScheduleStatus } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class UpdateGovernanceScheduleStatusDto {
    status: GovernanceScheduleStatus;
    reason: string;
    actor: GovernanceActorDto;
}
