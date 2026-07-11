import { PublisherDispatchMetricsService } from "./publisher-dispatch-metrics.service";
import { PublisherChannelMetricsService } from "./publisher-channel-metrics.service";
import { PublisherWorkerMetricsService } from "./publisher-worker-metrics.service";
export declare class PublisherEngineMetricsService {
    private readonly dispatch;
    private readonly channels;
    private readonly workers;
    constructor(dispatch: PublisherDispatchMetricsService, channels: PublisherChannelMetricsService, workers: PublisherWorkerMetricsService);
    metrics(): Promise<{
        dispatch: {
            dispatched: number;
            failed: number;
            generatedAt: Date;
        };
        channels: {
            success: boolean;
            channels: Record<string, any>;
            generatedAt: Date;
        };
        workers: {
            success: boolean;
            workers: Record<string, any>;
            generatedAt: Date;
        };
        generatedAt: Date;
    }>;
}
