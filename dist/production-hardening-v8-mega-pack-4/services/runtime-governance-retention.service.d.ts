import { GovernanceArchiveType, GovernanceDataClassification, GovernanceRetentionEvaluation, GovernanceRetentionPolicy } from "../contracts";
import { CreateGovernanceRetentionPolicyDto, UpdateGovernanceRetentionPolicyStatusDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
export declare class RuntimeGovernanceRetentionService {
    private readonly store;
    constructor(store: RuntimeGovernanceStore);
    create(dto: CreateGovernanceRetentionPolicyDto): GovernanceRetentionPolicy;
    evaluate(input: {
        policyId: string;
        resourceType: GovernanceArchiveType;
        resourceId: string;
        resourceCreatedAt: string;
        classification: GovernanceDataClassification;
    }): GovernanceRetentionEvaluation;
    updateStatus(id: string, dto: UpdateGovernanceRetentionPolicyStatusDto): GovernanceRetentionPolicy;
    list(): GovernanceRetentionPolicy[];
    listEvaluations(): GovernanceRetentionEvaluation[];
    get(id: string): GovernanceRetentionPolicy;
}
