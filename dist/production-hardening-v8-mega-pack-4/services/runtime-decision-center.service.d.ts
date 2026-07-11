import { RuntimeDecisionRecord } from "../contracts";
import { ReviewRuntimeDecisionDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeAutonomousApprovalService } from "./runtime-autonomous-approval.service";
import { RuntimeGovernanceApprovalMatrixService } from "./runtime-governance-approval-matrix.service";
import { RuntimeGovernanceRequestService } from "./runtime-governance-request.service";
import { RuntimeOperationalGuardrailService } from "./runtime-operational-guardrail.service";
export declare class RuntimeDecisionCenterService {
    private readonly store;
    private readonly requests;
    private readonly matrix;
    private readonly approvals;
    private readonly guardrails;
    constructor(store: RuntimeGovernanceStore, requests: RuntimeGovernanceRequestService, matrix: RuntimeGovernanceApprovalMatrixService, approvals: RuntimeAutonomousApprovalService, guardrails: RuntimeOperationalGuardrailService);
    generate(requestId: string, runtimeContext?: Record<string, unknown>): RuntimeDecisionRecord;
    list(): RuntimeDecisionRecord[];
    get(id: string): RuntimeDecisionRecord;
    review(id: string, dto: ReviewRuntimeDecisionDto): RuntimeDecisionRecord;
    markExecuted(id: string): RuntimeDecisionRecord;
    snapshot(): {
        totalDecisions: number;
        generatedDecisions: number;
        pendingReview: number;
        acceptedDecisions: number;
        rejectedDecisions: number;
        overriddenDecisions: number;
        executedDecisions: number;
        approvalSuggestions: number;
        activeGuardrails: number;
        guardrailEvaluations: number;
        failedGuardrails: number;
        warningGuardrails: number;
        generatedAt: string;
    };
    private confidenceFromScore;
}
