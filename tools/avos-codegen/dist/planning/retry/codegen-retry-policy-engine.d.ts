import { CodeGenRetryPolicy } from "../scheduling/codegen-scheduling.contracts";
export declare class CodeGenRetryPolicyEngine {
    create(input?: Partial<CodeGenRetryPolicy>): CodeGenRetryPolicy;
    delayForAttempt(policy: CodeGenRetryPolicy, attempt: number): number;
    shouldRetry(policy: CodeGenRetryPolicy, attempt: number, errorMessage: string): boolean;
}
//# sourceMappingURL=codegen-retry-policy-engine.d.ts.map