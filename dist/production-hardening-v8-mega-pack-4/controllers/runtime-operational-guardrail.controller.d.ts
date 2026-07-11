import { CreateRuntimeGuardrailDto, UpdateRuntimeGuardrailStatusDto } from "../dto";
import { RuntimeGovernanceRequestService, RuntimeOperationalGuardrailService } from "../services";
export declare class RuntimeOperationalGuardrailController {
    private readonly guardrails;
    private readonly requests;
    constructor(guardrails: RuntimeOperationalGuardrailService, requests: RuntimeGovernanceRequestService);
    create(dto: CreateRuntimeGuardrailDto): import("..").RuntimeGuardrail;
    list(): import("..").RuntimeGuardrail[];
    listEvaluations(): import("..").RuntimeGuardrailEvaluation[];
    get(id: string): import("..").RuntimeGuardrail;
    updateStatus(id: string, dto: UpdateRuntimeGuardrailStatusDto): import("..").RuntimeGuardrail;
    evaluateRequest(requestId: string, runtimeContext: Record<string, unknown>): import("..").RuntimeGuardrailEvaluation[];
}
