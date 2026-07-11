export interface CircuitBreakerOptions {
    failureThreshold?: number;
    successThreshold?: number;
    openDurationMs?: number;
    executionTimeoutMs?: number;
}
