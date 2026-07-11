import { CreateRuntimeSloDto, EvaluateRuntimeSloDto } from "../dto";
import { RuntimeSloService } from "../services";
export declare class RuntimeSloController {
    private readonly slos;
    constructor(slos: RuntimeSloService);
    create(dto: CreateRuntimeSloDto): import("..").RuntimeSloDefinition;
    evaluate(id: string, dto: EvaluateRuntimeSloDto): import("..").RuntimeSloEvaluation;
    listDefinitions(): import("..").RuntimeSloDefinition[];
    listEvaluations(): import("..").RuntimeSloEvaluation[];
    compliance(environment: string, namespace: string, service: string): {
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
    get(id: string): import("..").RuntimeSloDefinition;
}
