import { EvaluateRuntimeRiskDto } from "../dto";
import { RuntimeRiskEvaluationService } from "../services/runtime-risk-evaluation.service";
export declare class RuntimeRiskEvaluationController {
    private readonly risk;
    constructor(risk: RuntimeRiskEvaluationService);
    evaluate(dto: EvaluateRuntimeRiskDto): import("..").RuntimeRiskEvaluation;
    list(): import("..").RuntimeRiskEvaluation[];
    get(id: string): import("..").RuntimeRiskEvaluation;
}
