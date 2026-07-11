export interface PublisherRetryDecision {
    retry: boolean;
    attempt: number;
    maxAttempts: number;
    delayMs: number;
    reason: string;
}
export declare class PublisherRetryPolicyService {
    private readonly defaultMaxAttempts;
    private readonly initialDelayMs;
    private readonly maximumDelayMs;
    private readonly multiplier;
    maxAttempts(job?: any): number;
    currentAttempt(job?: any): number;
    decide(job: any, attempt: number, error?: unknown, status?: string): PublisherRetryDecision;
    private isRetryable;
    private calculateDelay;
    private readPositiveInteger;
    private readNonNegativeInteger;
    private readPositiveNumber;
    private toPositiveInteger;
    private toNonNegativeInteger;
    private errorMessage;
}
