import { CreateGovernanceEscalationDto, GovernanceActorDto, UpdateGovernanceEscalationDto } from "../dto";
import { RuntimeGovernanceEscalationService } from "../services";
export declare class RuntimeGovernanceEscalationController {
    private readonly escalations;
    constructor(escalations: RuntimeGovernanceEscalationService);
    create(dto: CreateGovernanceEscalationDto): import("..").GovernanceEscalation;
    list(): import("..").GovernanceEscalation[];
    get(id: string): import("..").GovernanceEscalation;
    update(id: string, dto: UpdateGovernanceEscalationDto): import("..").GovernanceEscalation;
    createNotification(id: string, actor: GovernanceActorDto): import("..").GovernanceNotification;
}
