import { AddIncidentTimelineDto } from "./dto/add-incident-timeline.dto";
import { AssignIncidentMemberDto } from "./dto/assign-incident-member.dto";
import { CreateEnterpriseIncidentDto } from "./dto/create-enterprise-incident.dto";
import { CreateIncidentActionDto } from "./dto/create-incident-action.dto";
import { UpdateIncidentStatusDto } from "./dto/update-incident-status.dto";
import { UpdateOperationalStatusDto } from "./dto/update-operational-status.dto";
import { IncidentCommandService } from "./incident-command.service";
import { IncidentStatus } from "./types/mega-pack-6.types";
export declare class IncidentCommandController {
    private readonly incidents;
    constructor(incidents: IncidentCommandService);
    create(dto: CreateEnterpriseIncidentDto): Promise<import("./types/mega-pack-6.types").EnterpriseIncident>;
    list(status?: IncidentStatus): Promise<import("./types/mega-pack-6.types").EnterpriseIncident[]>;
    summary(): Promise<{
        total: number;
        open: number;
        criticalOpen: number;
        declared: number;
        recovering: number;
        resolved: number;
    }>;
    get(id: string): Promise<import("./types/mega-pack-6.types").EnterpriseIncident>;
    updateStatus(id: string, dto: UpdateIncidentStatusDto & {
        actor?: string;
    }): Promise<import("./types/mega-pack-6.types").EnterpriseIncident>;
    assignMember(id: string, dto: AssignIncidentMemberDto): Promise<import("./types/mega-pack-6.types").EnterpriseIncident>;
    addTimeline(id: string, dto: AddIncidentTimelineDto): Promise<import("./types/mega-pack-6.types").EnterpriseIncident>;
    addAction(id: string, dto: CreateIncidentActionDto): Promise<import("./types/mega-pack-6.types").EnterpriseIncident>;
    updateActionStatus(incidentId: string, actionId: string, dto: UpdateOperationalStatusDto & {
        actor?: string;
    }): Promise<import("./types/mega-pack-6.types").EnterpriseIncident>;
}
