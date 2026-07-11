import { GovernanceDashboardSnapshot } from "../contracts";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
export declare class RuntimeGovernanceDashboardService {
    private readonly store;
    private readonly audit;
    constructor(store: RuntimeGovernanceStore, audit: RuntimeGovernanceAuditService);
    snapshot(): GovernanceDashboardSnapshot;
}
