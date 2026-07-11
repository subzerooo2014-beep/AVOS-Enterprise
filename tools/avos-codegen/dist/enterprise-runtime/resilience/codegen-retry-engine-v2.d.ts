import { CodeGenRetryExecutionResult, CodeGenRetryPolicyV2 } from "./codegen-retry-v2.contracts";
export declare class CodeGenRetryEngineV2 {
    normalize(input?: Partial<CodeGenRetryPolicyV2>): CodeGenRetryPolicyV2;
    execute<T>(operation: (attempt: number) => Promise<T>, policyInput?: Partial<CodeGenRetryPolicyV2>): Promise<CodeGenRetryExecutionResult<T>>;
    delayForAttempt(policy: CodeGenRetryPolicyV2, attempt: number): number;
    shouldRetry(errorMessage: string, policy: CodeGenRetryPolicyV2): boolean;
}
//# sourceMappingURL=codegen-retry-engine-v2.d.ts.map