import { GovernanceChangeWindow } from "../contracts";
import { CreateChangeWindowDto, UpdateChangeWindowStatusDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
export declare class RuntimeChangeWindowService {
    private readonly store;
    private readonly audit;
    constructor(store: RuntimeGovernanceStore, audit: RuntimeGovernanceAuditService);
    create(dto: CreateChangeWindowDto): GovernanceChangeWindow;
    list(): GovernanceChangeWindow[];
    get(id: string): GovernanceChangeWindow;
    updateStatus(id: string, dto: UpdateChangeWindowStatusDto): GovernanceChangeWindow;
    isRequestAllowed(windowId: string, requestType: string, riskLevel: string): {
        allowed: boolean;
        reason: string;
    };
    private normalizeStatus;
    private validateTransition;
}
