import { RuntimeRunbookStatus } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class UpdateRuntimeRunbookStatusDto {
    status: RuntimeRunbookStatus;
    reason: string;
    actor: GovernanceActorDto;
}
