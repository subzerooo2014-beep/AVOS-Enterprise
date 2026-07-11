import { CreateMaintenanceModeDto, UpdateMaintenanceModeStatusDto } from "../dto";
import { RuntimeMaintenanceModeService } from "../services";
export declare class RuntimeMaintenanceModeController {
    private readonly maintenance;
    constructor(maintenance: RuntimeMaintenanceModeService);
    create(dto: CreateMaintenanceModeDto): import("..").GovernanceMaintenanceMode;
    list(): import("..").GovernanceMaintenanceMode[];
    accessPolicy(environment: string, namespace: string, service?: string): {
        maintenanceActive: boolean;
        allowReadOperations: boolean;
        allowWriteOperations: boolean;
        allowBackgroundJobs: boolean;
        allowDeployments: boolean;
        publicMessage?: string;
    };
    get(id: string): import("..").GovernanceMaintenanceMode;
    updateStatus(id: string, dto: UpdateMaintenanceModeStatusDto): import("..").GovernanceMaintenanceMode;
}
