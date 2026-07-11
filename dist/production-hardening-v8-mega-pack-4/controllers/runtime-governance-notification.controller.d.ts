import { CreateGovernanceNotificationDto, GovernanceActorDto } from "../dto";
import { RuntimeGovernanceNotificationService } from "../services";
export declare class RuntimeGovernanceNotificationController {
    private readonly notifications;
    constructor(notifications: RuntimeGovernanceNotificationService);
    create(dto: CreateGovernanceNotificationDto): import("..").GovernanceNotification;
    list(): import("..").GovernanceNotification[];
    get(id: string): import("..").GovernanceNotification;
    send(id: string, actor: GovernanceActorDto): import("..").GovernanceNotification;
    delivered(id: string): import("..").GovernanceNotification;
}
