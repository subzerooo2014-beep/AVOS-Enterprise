import { RuntimeGovernanceAuditService } from "../services";
export declare class RuntimeGovernanceAuditController {
    private readonly audit;
    constructor(audit: RuntimeGovernanceAuditService);
    list(): import("..").GovernanceAuditEntry[];
    verify(): import("..").GovernanceIntegrityResult;
}
