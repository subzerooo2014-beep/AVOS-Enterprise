import { EvaluateGovernanceRequestDto } from "../dto";
import { RuntimeGovernanceEvaluationService } from "../services";
export declare class RuntimeGovernanceEvaluationController {
    private readonly evaluations;
    constructor(evaluations: RuntimeGovernanceEvaluationService);
    evaluate(id: string, dto: EvaluateGovernanceRequestDto): import("..").GovernanceRequest;
}
