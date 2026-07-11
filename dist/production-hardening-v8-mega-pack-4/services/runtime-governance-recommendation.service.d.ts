import { GovernanceRecommendation, GovernanceRequest } from "../contracts";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
export declare class RuntimeGovernanceRecommendationService {
    private readonly store;
    private readonly audit;
    constructor(store: RuntimeGovernanceStore, audit: RuntimeGovernanceAuditService);
    generate(request: GovernanceRequest): GovernanceRecommendation[];
    list(): GovernanceRecommendation[];
    private create;
}
