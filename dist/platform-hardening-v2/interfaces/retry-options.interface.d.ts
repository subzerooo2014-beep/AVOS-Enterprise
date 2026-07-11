export interface RetryOptions {
    attempts?: number;
    initialDelayMs?: number;
    maximumDelayMs?: number;
    backoffMultiplier?: number;
    shouldRetry?: (error: unknown, attempt: number) => boolean;
}
