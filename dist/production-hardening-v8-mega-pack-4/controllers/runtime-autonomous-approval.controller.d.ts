import { RuntimeAutonomousApprovalService, RuntimeGovernanceRequestService } from "../services";
export declare class RuntimeAutonomousApprovalController {
    private readonly approvals;
    private readonly requests;
    constructor(approvals: RuntimeAutonomousApprovalService, requests: RuntimeGovernanceRequestService);
    generate(requestId: string, runtimeContext: Record<string, unknown>): import("..").AutonomousApprovalSuggestion;
    list(): import("..").AutonomousApprovalSuggestion[];
}
