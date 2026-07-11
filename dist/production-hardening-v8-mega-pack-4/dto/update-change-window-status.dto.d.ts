import { ChangeWindowStatus } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class UpdateChangeWindowStatusDto {
    status: ChangeWindowStatus;
    reason: string;
    actor: GovernanceActorDto;
}
