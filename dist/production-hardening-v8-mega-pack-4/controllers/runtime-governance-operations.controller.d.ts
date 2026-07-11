import { CreateGovernanceTimelineEventDto } from "../dto";
import { RuntimeGovernanceOperationsStatusService, RuntimeGovernanceTimelineService } from "../services";
export declare class RuntimeGovernanceOperationsController {
    private readonly timeline;
    private readonly status;
    constructor(timeline: RuntimeGovernanceTimelineService, status: RuntimeGovernanceOperationsStatusService);
    appendTimeline(dto: CreateGovernanceTimelineEventDto): import("..").GovernanceTimelineEvent;
    listTimeline(aggregateType?: string, aggregateId?: string): import("..").GovernanceTimelineEvent[];
    snapshot(): import("..").GovernanceOperationsSnapshot;
}
