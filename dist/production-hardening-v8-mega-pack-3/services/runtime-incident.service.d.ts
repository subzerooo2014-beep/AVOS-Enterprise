import { RuntimeIncident } from "../contracts/runtime-resilience.contracts";
import { RuntimeIncidentStatus } from "../contracts/runtime-resilience.enums";
import { CreateRuntimeIncidentDto, UpdateRuntimeIncidentDto } from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";
export declare class RuntimeIncidentService {
    private readonly store;
    private readonly evidence;
    constructor(store: RuntimeResilienceStore, evidence: RuntimeEvidenceChainService);
    create(dto: CreateRuntimeIncidentDto): RuntimeIncident;
    list(filters?: {
        status?: RuntimeIncidentStatus;
        environment?: string;
        namespace?: string;
        service?: string;
    }): RuntimeIncident[];
    get(id: string): RuntimeIncident;
    update(id: string, dto: UpdateRuntimeIncidentDto): RuntimeIncident;
    attachAction(incidentId: string, actionId: string): RuntimeIncident;
    private nextIncidentNumber;
    private validateSignalReferences;
    private validateConfigurationReferences;
    private validateStatusTransition;
}
