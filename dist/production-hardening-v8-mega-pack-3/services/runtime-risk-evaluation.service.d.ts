import { RuntimeRiskEvaluation } from "../contracts/runtime-resilience.contracts";
import { EvaluateRuntimeRiskDto } from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";
import { ResiliencePolicyEvaluatorService } from "./resilience-policy-evaluator.service";
export declare class RuntimeRiskEvaluationService {
    private readonly store;
    private readonly evidence;
    private readonly evaluator;
    constructor(store: RuntimeResilienceStore, evidence: RuntimeEvidenceChainService, evaluator: ResiliencePolicyEvaluatorService);
    evaluate(dto: EvaluateRuntimeRiskDto): RuntimeRiskEvaluation;
    list(): RuntimeRiskEvaluation[];
    get(id: string): RuntimeRiskEvaluation;
    private resolvePolicy;
    private buildRiskFactors;
    private createFactor;
    private environmentScore;
    private changeTypeScore;
    private numericContextScore;
    private booleanInverseScore;
    private inversePercentageScore;
    private activeIncidentScore;
}
