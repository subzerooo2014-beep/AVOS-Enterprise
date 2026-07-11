import { RuntimeIncidentStatus } from "../contracts/runtime-resilience.enums";
import { CreateRuntimeIncidentDto, UpdateRuntimeIncidentDto } from "../dto";
import { RuntimeIncidentService } from "../services/runtime-incident.service";
export declare class RuntimeIncidentController {
    private readonly incidents;
    constructor(incidents: RuntimeIncidentService);
    create(dto: CreateRuntimeIncidentDto): import("..").RuntimeIncident;
    list(status?: RuntimeIncidentStatus, environment?: string, namespace?: string, service?: string): import("..").RuntimeIncident[];
    get(id: string): import("..").RuntimeIncident;
    update(id: string, dto: UpdateRuntimeIncidentDto): import("..").RuntimeIncident;
}
