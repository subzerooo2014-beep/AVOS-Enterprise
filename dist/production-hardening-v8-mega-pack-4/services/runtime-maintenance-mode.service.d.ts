import { GovernanceMaintenanceMode } from "../contracts";
import { CreateMaintenanceModeDto, UpdateMaintenanceModeStatusDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
export declare class RuntimeMaintenanceModeService {
    private readonly store;
    private readonly audit;
    constructor(store: RuntimeGovernanceStore, audit: RuntimeGovernanceAuditService);
    create(dto: CreateMaintenanceModeDto): GovernanceMaintenanceMode;
    list(): GovernanceMaintenanceMode[];
    get(id: string): GovernanceMaintenanceMode;
    updateStatus(id: string, dto: UpdateMaintenanceModeStatusDto): GovernanceMaintenanceMode;
    getAccessPolicy(environment: string, namespace: string, service?: string): {
        maintenanceActive: boolean;
        allowReadOperations: boolean;
        allowWriteOperations: boolean;
        allowBackgroundJobs: boolean;
        allowDeployments: boolean;
        publicMessage?: string;
    };
    private normalizeStatus;
    private validateTransition;
}
