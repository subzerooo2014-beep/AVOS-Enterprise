import { GovernanceEscalation } from "../contracts";
import { CreateGovernanceEscalationDto, UpdateGovernanceEscalationDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceNotificationService } from "./runtime-governance-notification.service";
import { RuntimeGovernanceTimelineService } from "./runtime-governance-timeline.service";
export declare class RuntimeGovernanceEscalationService {
    private readonly store;
    private readonly notifications;
    private readonly timeline;
    constructor(store: RuntimeGovernanceStore, notifications: RuntimeGovernanceNotificationService, timeline: RuntimeGovernanceTimelineService);
    create(dto: CreateGovernanceEscalationDto): GovernanceEscalation;
    createNotification(id: string, actor: {
        id: string;
        type: "user" | "service" | "system" | "automation";
        name?: string;
        roles: string[];
    }): import("../contracts").GovernanceNotification;
    update(id: string, dto: UpdateGovernanceEscalationDto): GovernanceEscalation;
    list(): GovernanceEscalation[];
    get(id: string): GovernanceEscalation;
    private expireEscalations;
    private validateTransition;
    private nextEscalationNumber;
    private priorityFromSeverity;
}
