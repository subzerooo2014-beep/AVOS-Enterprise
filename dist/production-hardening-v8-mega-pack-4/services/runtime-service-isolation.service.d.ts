import { ServiceIsolationPlan } from "../contracts";
import { CreateIsolationPlanDto, UpdateIsolationPlanStatusDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
export declare class RuntimeServiceIsolationService {
    private readonly store;
    private readonly audit;
    constructor(store: RuntimeGovernanceStore, audit: RuntimeGovernanceAuditService);
    create(dto: CreateIsolationPlanDto): ServiceIsolationPlan;
    list(): ServiceIsolationPlan[];
    get(id: string): ServiceIsolationPlan;
    updateStatus(id: string, dto: UpdateIsolationPlanStatusDto): ServiceIsolationPlan;
    private buildRecommendations;
    private validateTransition;
}
