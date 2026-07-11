import { GovernanceImpactAnalysis } from "../contracts";
import { AnalyzeGovernanceImpactDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceRequestService } from "./runtime-governance-request.service";
export declare class RuntimeGovernanceImpactService {
    private readonly store;
    private readonly requests;
    constructor(store: RuntimeGovernanceStore, requests: RuntimeGovernanceRequestService);
    analyze(requestId: string, dto: AnalyzeGovernanceImpactDto): GovernanceImpactAnalysis;
    list(): GovernanceImpactAnalysis[];
    get(id: string): GovernanceImpactAnalysis;
    private buildRecommendations;
}
