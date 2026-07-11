import { RuntimeSloDefinition, RuntimeSloEvaluation } from "../contracts";
import { CreateRuntimeSloDto, EvaluateRuntimeSloDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
export declare class RuntimeSloService {
    private readonly store;
    private readonly audit;
    constructor(store: RuntimeGovernanceStore, audit: RuntimeGovernanceAuditService);
    create(dto: CreateRuntimeSloDto): RuntimeSloDefinition;
    evaluate(id: string, dto: EvaluateRuntimeSloDto): RuntimeSloEvaluation;
    listDefinitions(): RuntimeSloDefinition[];
    listEvaluations(): RuntimeSloEvaluation[];
    get(id: string): RuntimeSloDefinition;
    getServiceCompliance(environment: string, namespace: string, service: string): {
        environment: string;
        namespace: string;
        service: string;
        definitions: number;
        compliant: number;
        atRisk: number;
        breached: number;
        unknown: number;
        compliancePercentage: number;
        evaluatedAt: string;
    };
    private resolveComplianceStatus;
    private calculateBreachPercentage;
}
