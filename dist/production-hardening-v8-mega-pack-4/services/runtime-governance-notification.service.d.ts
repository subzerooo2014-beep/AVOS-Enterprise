import { GovernanceNotification } from "../contracts";
import { CreateGovernanceNotificationDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceTimelineService } from "./runtime-governance-timeline.service";
export declare class RuntimeGovernanceNotificationService {
    private readonly store;
    private readonly timeline;
    constructor(store: RuntimeGovernanceStore, timeline: RuntimeGovernanceTimelineService);
    create(dto: CreateGovernanceNotificationDto): GovernanceNotification;
    send(id: string, actor: {
        id: string;
        type: "user" | "service" | "system" | "automation";
        name?: string;
        roles: string[];
    }): GovernanceNotification;
    markDelivered(id: string): GovernanceNotification;
    markFailed(id: string, error: string): GovernanceNotification;
    list(): GovernanceNotification[];
    get(id: string): GovernanceNotification;
    private nextNotificationNumber;
}
