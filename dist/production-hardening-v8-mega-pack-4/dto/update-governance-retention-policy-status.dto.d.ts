import { GovernanceRetentionStatus } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class UpdateGovernanceRetentionPolicyStatusDto {
    status: GovernanceRetentionStatus;
    reason: string;
    actor: GovernanceActorDto;
}
