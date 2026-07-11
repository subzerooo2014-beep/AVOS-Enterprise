import { CreateCapacityPolicyDto, EvaluateCapacityPolicyDto } from "../dto";
import { RuntimeCapacityGovernanceService } from "../services";
export declare class RuntimeCapacityGovernanceController {
    private readonly capacity;
    constructor(capacity: RuntimeCapacityGovernanceService);
    createPolicy(dto: CreateCapacityPolicyDto): import("..").RuntimeCapacityPolicy;
    evaluate(id: string, dto: EvaluateCapacityPolicyDto): import("..").RuntimeCapacityEvaluation;
    listPolicies(): import("..").RuntimeCapacityPolicy[];
    listEvaluations(): import("..").RuntimeCapacityEvaluation[];
    getPolicy(id: string): import("..").RuntimeCapacityPolicy;
}
