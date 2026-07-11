import { GovernanceRequest } from "../contracts";
import { CreateGovernanceRequestDto, RecordGovernanceApprovalDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeChangeWindowService } from "./runtime-change-window.service";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
import { RuntimeMaintenanceModeService } from "./runtime-maintenance-mode.service";
export declare class RuntimeGovernanceRequestService {
    private readonly store;
    private readonly audit;
    private readonly changeWindows;
    private readonly maintenance;
    constructor(store: RuntimeGovernanceStore, audit: RuntimeGovernanceAuditService, changeWindows: RuntimeChangeWindowService, maintenance: RuntimeMaintenanceModeService);
    create(dto: CreateGovernanceRequestDto): GovernanceRequest;
    list(): GovernanceRequest[];
    get(id: string): GovernanceRequest;
    recordApproval(id: string, dto: RecordGovernanceApprovalDto): GovernanceRequest;
    markExecuted(id: string, actor: {
        id: string;
        type: "user" | "service" | "system" | "automation";
        name?: string;
        roles: string[];
    }): GovernanceRequest;
    private nextRequestNumber;
}
