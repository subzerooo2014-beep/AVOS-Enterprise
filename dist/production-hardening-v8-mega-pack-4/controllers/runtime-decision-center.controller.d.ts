import { ReviewRuntimeDecisionDto } from "../dto";
import { RuntimeDecisionCenterService } from "../services";
export declare class RuntimeDecisionCenterController {
    private readonly decisions;
    constructor(decisions: RuntimeDecisionCenterService);
    generate(requestId: string, runtimeContext: Record<string, unknown>): import("..").RuntimeDecisionRecord;
    list(): import("..").RuntimeDecisionRecord[];
    get(id: string): import("..").RuntimeDecisionRecord;
    review(id: string, dto: ReviewRuntimeDecisionDto): import("..").RuntimeDecisionRecord;
    execute(id: string): import("..").RuntimeDecisionRecord;
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
}
