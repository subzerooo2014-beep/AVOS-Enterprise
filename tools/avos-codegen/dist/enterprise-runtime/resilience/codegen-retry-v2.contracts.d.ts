export interface CodeGenRetryPolicyV2 {
    maximumAttempts: number;
    initialDelayMs: number;
    maximumDelayMs: number;
    multiplier: number;
    retryableErrorPatterns: string[];
}
export interface CodeGenRetryAttempt {
    attempt: number;
    delayMs: number;
    error: string;
    startedAt: string;
    completedAt: string;
}
export interface CodeGenRetryExecutionResult<T> {
    success: boolean;
    value?: T;
    attempts: CodeGenRetryAttempt[];
    error?: string;
    completedAt: string;
}
//# sourceMappingURL=codegen-retry-v2.contracts.d.ts.map