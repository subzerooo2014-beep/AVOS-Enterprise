import { PolicyEvaluation } from "../interfaces/policy-evaluation.interface";
import { PolicyViolation } from "../interfaces/policy-violation.interface";
export declare class PolicyViolationRegistryService {
    private readonly violations;
    register(input: {
        method: string;
        path: string;
        evaluation: PolicyEvaluation;
        correlationId?: string;
        traceId?: string;
        actor?: string;
    }): PolicyViolation;
    findAll(limit?: number): PolicyViolation[];
    getSummary(): {
        total: number;
        denied: number;
        highRisk: number;
        criticalRisk: number;
    };
}
