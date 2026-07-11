import { RuntimeGuardrailCondition } from "../contracts";
export declare class RuntimeGuardrailEvaluatorService {
    evaluateConditions(conditions: RuntimeGuardrailCondition[], context: Record<string, unknown>): boolean;
    private evaluateCondition;
    private resolvePath;
    private equal;
}
