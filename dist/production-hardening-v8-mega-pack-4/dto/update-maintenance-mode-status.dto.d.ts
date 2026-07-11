import { MaintenanceModeStatus } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class UpdateMaintenanceModeStatusDto {
    status: MaintenanceModeStatus;
    reason: string;
    actor: GovernanceActorDto;
}
