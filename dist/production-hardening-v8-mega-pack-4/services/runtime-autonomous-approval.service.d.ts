import { AutonomousApprovalSuggestion, GovernanceRequest } from "../contracts";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceApprovalMatrixService } from "./runtime-governance-approval-matrix.service";
import { RuntimeOperationalGuardrailService } from "./runtime-operational-guardrail.service";
export declare class RuntimeAutonomousApprovalService {
    private readonly store;
    private readonly matrix;
    private readonly guardrails;
    constructor(store: RuntimeGovernanceStore, matrix: RuntimeGovernanceApprovalMatrixService, guardrails: RuntimeOperationalGuardrailService);
    generate(request: GovernanceRequest, runtimeContext?: Record<string, unknown>): AutonomousApprovalSuggestion;
    list(): AutonomousApprovalSuggestion[];
    private confidenceFromScore;
}
