import { GovernanceRequest, RuntimeGuardrail, RuntimeGuardrailEvaluation } from "../contracts";
import { CreateRuntimeGuardrailDto, UpdateRuntimeGuardrailStatusDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGuardrailEvaluatorService } from "./runtime-guardrail-evaluator.service";
export declare class RuntimeOperationalGuardrailService {
    private readonly store;
    private readonly evaluator;
    constructor(store: RuntimeGovernanceStore, evaluator: RuntimeGuardrailEvaluatorService);
    create(dto: CreateRuntimeGuardrailDto): RuntimeGuardrail;
    list(): RuntimeGuardrail[];
    get(id: string): RuntimeGuardrail;
    updateStatus(id: string, dto: UpdateRuntimeGuardrailStatusDto): RuntimeGuardrail;
    evaluateRequest(request: GovernanceRequest, context: Record<string, unknown>): RuntimeGuardrailEvaluation[];
    listEvaluations(): RuntimeGuardrailEvaluation[];
}
