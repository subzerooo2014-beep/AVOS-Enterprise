import { AddIncidentTimelineDto } from "./dto/add-incident-timeline.dto";
import { AssignIncidentMemberDto } from "./dto/assign-incident-member.dto";
import { CreateEnterpriseIncidentDto } from "./dto/create-enterprise-incident.dto";
import { CreateIncidentActionDto } from "./dto/create-incident-action.dto";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import { EnterpriseIncident, IncidentStatus, OperationalStatus } from "./types/mega-pack-6.types";
export declare class IncidentCommandService {
    private readonly storage;
    private readonly sequence;
    private readonly events;
    constructor(storage: MegaPack6StorageService, sequence: EnterpriseSequenceService, events: PlatformEventBusService);
    create(dto: CreateEnterpriseIncidentDto): Promise<EnterpriseIncident>;
    list(status?: IncidentStatus): Promise<EnterpriseIncident[]>;
    get(id: string): Promise<EnterpriseIncident>;
    updateStatus(id: string, status: IncidentStatus, actor?: string): Promise<EnterpriseIncident>;
    assignMember(id: string, dto: AssignIncidentMemberDto): Promise<EnterpriseIncident>;
    addTimeline(id: string, dto: AddIncidentTimelineDto): Promise<EnterpriseIncident>;
    addAction(id: string, dto: CreateIncidentActionDto): Promise<EnterpriseIncident>;
    updateActionStatus(incidentId: string, actionId: string, status: OperationalStatus, actor?: string): Promise<EnterpriseIncident>;
    summary(): Promise<{
        total: number;
        open: number;
        criticalOpen: number;
        declared: number;
        recovering: number;
        resolved: number;
    }>;
    private validateStatusTransition;
}
