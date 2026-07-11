import { RuntimeDecisionRecordStatus } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class ReviewRuntimeDecisionDto {
    status: RuntimeDecisionRecordStatus;
    reason: string;
    overrideReason?: string;
    actor: GovernanceActorDto;
}
