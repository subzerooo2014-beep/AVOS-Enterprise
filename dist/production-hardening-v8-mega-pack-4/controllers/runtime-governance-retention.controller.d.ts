import { CreateGovernanceRetentionPolicyDto, UpdateGovernanceRetentionPolicyStatusDto } from "../dto";
import { RuntimeGovernanceRetentionService } from "../services";
export declare class RuntimeGovernanceRetentionController {
    private readonly retention;
    constructor(retention: RuntimeGovernanceRetentionService);
    createPolicy(dto: CreateGovernanceRetentionPolicyDto): import("..").GovernanceRetentionPolicy;
    listPolicies(): import("..").GovernanceRetentionPolicy[];
    listEvaluations(): import("..").GovernanceRetentionEvaluation[];
    updateStatus(id: string, dto: UpdateGovernanceRetentionPolicyStatusDto): import("..").GovernanceRetentionPolicy;
    evaluate(body: {
        policyId: string;
        resourceType: any;
        resourceId: string;
        resourceCreatedAt: string;
        classification: any;
    }): import("..").GovernanceRetentionEvaluation;
}
