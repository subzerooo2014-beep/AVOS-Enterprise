import { GovernanceTimelineEvent } from "../contracts";
import { CreateGovernanceTimelineEventDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
export declare class RuntimeGovernanceTimelineService {
    private readonly store;
    constructor(store: RuntimeGovernanceStore);
    append(dto: CreateGovernanceTimelineEventDto): GovernanceTimelineEvent;
    list(filters?: {
        aggregateType?: string;
        aggregateId?: string;
    }): GovernanceTimelineEvent[];
}
