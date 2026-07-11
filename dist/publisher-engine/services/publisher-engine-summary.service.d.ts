import { PublisherEngineMetricsService } from "./publisher-engine-metrics.service";
import { PublisherReadyService } from "./publisher-ready.service";
export declare class PublisherEngineSummaryService {
    private readonly metrics;
    private readonly ready;
    constructor(metrics: PublisherEngineMetricsService, ready: PublisherReadyService);
    summary(): Promise<{
        ready: {
            success: boolean;
            engine: string;
            state: string;
            timestamp: Date;
        };
        metrics: {
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
        };
        generatedAt: Date;
    }>;
}
