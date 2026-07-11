import { RuntimeCapacityEvaluation, RuntimeCapacityPolicy } from "../contracts";
import { CreateCapacityPolicyDto, EvaluateCapacityPolicyDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
export declare class RuntimeCapacityGovernanceService {
    private readonly store;
    private readonly audit;
    constructor(store: RuntimeGovernanceStore, audit: RuntimeGovernanceAuditService);
    create(dto: CreateCapacityPolicyDto): RuntimeCapacityPolicy;
    evaluate(id: string, dto: EvaluateCapacityPolicyDto): RuntimeCapacityEvaluation;
    listPolicies(): RuntimeCapacityPolicy[];
    listEvaluations(): RuntimeCapacityEvaluation[];
    get(id: string): RuntimeCapacityPolicy;
}
