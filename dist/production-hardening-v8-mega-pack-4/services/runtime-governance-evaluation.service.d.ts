import { EvaluateGovernanceRequestDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeChangeWindowService } from "./runtime-change-window.service";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
import { RuntimeGovernanceRecommendationService } from "./runtime-governance-recommendation.service";
import { RuntimeGovernanceRequestService } from "./runtime-governance-request.service";
import { RuntimeMaintenanceModeService } from "./runtime-maintenance-mode.service";
export declare class RuntimeGovernanceEvaluationService {
    private readonly store;
    private readonly requests;
    private readonly changeWindows;
    private readonly maintenance;
    private readonly recommendations;
    private readonly audit;
    constructor(store: RuntimeGovernanceStore, requests: RuntimeGovernanceRequestService, changeWindows: RuntimeChangeWindowService, maintenance: RuntimeMaintenanceModeService, recommendations: RuntimeGovernanceRecommendationService, audit: RuntimeGovernanceAuditService);
    evaluate(id: string, dto: EvaluateGovernanceRequestDto): import("../contracts").GovernanceRequest;
    private buildFactors;
    private factor;
    private riskLevelScore;
}
