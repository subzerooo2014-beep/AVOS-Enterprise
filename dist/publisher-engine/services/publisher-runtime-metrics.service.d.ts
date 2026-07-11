export declare class PublisherRuntimeMetricsService {
    private readonly channels;
    recordAttempt(channel: string): void;
    recordSuccess(channel: string, durationMs: number): void;
    recordFailure(channel: string, durationMs: number): void;
    recordRetry(channel: string): void;
    recordDeadLetter(channel: string): void;
    summary(): {
        channels: {
            averageDurationMs: number;
            channel: string;
            attempted: number;
            published: number;
            failed: number;
            retried: number;
            deadLettered: number;
            totalDurationMs: number;
            lastDurationMs: number;
            lastAttemptAt?: Date;
            lastSuccessAt?: Date;
            lastFailureAt?: Date;
        }[];
        totals: {
            attempted: number;
            published: number;
            failed: number;
            retried: number;
            deadLettered: number;
        };
        generatedAt: Date;
    };
    private getOrCreate;
    private recordDuration;
}
