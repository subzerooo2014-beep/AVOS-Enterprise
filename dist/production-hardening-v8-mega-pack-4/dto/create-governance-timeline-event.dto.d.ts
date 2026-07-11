import { GovernanceTimelineEventType } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateGovernanceTimelineEventDto {
    aggregateType: string;
    aggregateId: string;
    type: GovernanceTimelineEventType;
    title: string;
    description?: string;
    relatedResourceIds?: string[];
    payload?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
