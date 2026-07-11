import { CreateApprovalMatrixRuleDto } from "../dto";
import { RuntimeGovernanceApprovalMatrixService, RuntimeGovernanceRequestService } from "../services";
export declare class RuntimeGovernanceApprovalMatrixController {
    private readonly matrix;
    private readonly requests;
    constructor(matrix: RuntimeGovernanceApprovalMatrixService, requests: RuntimeGovernanceRequestService);
    createRule(dto: CreateApprovalMatrixRuleDto): import("..").GovernanceApprovalMatrixRule;
    listRules(): import("..").GovernanceApprovalMatrixRule[];
    getRule(id: string): import("..").GovernanceApprovalMatrixRule;
    evaluate(requestId: string): import("..").GovernanceApprovalMatrixDecision;
}
