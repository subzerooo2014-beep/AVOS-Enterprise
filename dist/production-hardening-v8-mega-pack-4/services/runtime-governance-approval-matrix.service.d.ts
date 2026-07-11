import { GovernanceApprovalMatrixDecision, GovernanceApprovalMatrixRule, GovernanceRequest } from "../contracts";
import { CreateApprovalMatrixRuleDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
export declare class RuntimeGovernanceApprovalMatrixService {
    private readonly store;
    constructor(store: RuntimeGovernanceStore);
    createRule(dto: CreateApprovalMatrixRuleDto): GovernanceApprovalMatrixRule;
    listRules(): GovernanceApprovalMatrixRule[];
    getRule(id: string): GovernanceApprovalMatrixRule;
    evaluate(request: GovernanceRequest): GovernanceApprovalMatrixDecision;
    private isRiskWithinRange;
}
