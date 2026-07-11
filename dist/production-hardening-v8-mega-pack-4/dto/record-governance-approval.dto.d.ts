import { GovernanceApprovalStatus } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class RecordGovernanceApprovalDto {
    status: GovernanceApprovalStatus;
    reason: string;
    expiresAt?: string;
    actor: GovernanceActorDto;
}
