export type PublisherCircuitState = "closed" | "open" | "half-open";
export interface PublisherCircuitSnapshot {
    channel: string;
    state: PublisherCircuitState;
    consecutiveFailures: number;
    consecutiveSuccesses: number;
    openedAt?: Date;
    lastFailureAt?: Date;
    lastSuccessAt?: Date;
}
export declare class PublisherCircuitBreakerService {
    private readonly failureThreshold;
    private readonly successThreshold;
    private readonly openDurationMs;
    private readonly circuits;
    canExecute(channel: string): boolean;
    recordSuccess(channel: string): void;
    recordFailure(channel: string): void;
    forceOpen(channel: string): void;
    reset(channel: string): void;
    snapshot(): PublisherCircuitSnapshot[];
    private getOrCreate;
    private normalize;
    private readPositiveInteger;
}
