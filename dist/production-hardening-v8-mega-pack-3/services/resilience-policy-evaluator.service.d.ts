import { ResiliencePolicyCondition } from "../contracts/runtime-resilience.contracts";
export declare class ResiliencePolicyEvaluatorService {
    evaluateConditions(conditions: ResiliencePolicyCondition[], context: Record<string, unknown>): boolean;
    private evaluateCondition;
    private resolvePath;
    private toNumber;
    private isEqual;
}
