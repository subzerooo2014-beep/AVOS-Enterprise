export declare class PublisherDispatchMetricsService {
    private dispatched;
    private failed;
    success(): void;
    failure(): void;
    report(): {
        dispatched: number;
        failed: number;
        generatedAt: Date;
    };
}
