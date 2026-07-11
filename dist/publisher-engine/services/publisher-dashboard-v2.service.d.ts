import { PublisherStatisticsService } from "./publisher-statistics.service";
import { PublisherPerformanceService } from "./publisher-performance.service";
import { PublisherChannelMetricsService } from "./publisher-channel-metrics.service";
import { PublisherWorkerMetricsService } from "./publisher-worker-metrics.service";
export declare class PublisherDashboardV2Service {
    private readonly statistics;
    private readonly performance;
    private readonly channels;
    private readonly workers;
    constructor(statistics: PublisherStatisticsService, performance: PublisherPerformanceService, channels: PublisherChannelMetricsService, workers: PublisherWorkerMetricsService);
    dashboard(): Promise<{
        success: boolean;
        statistics: {
            success: boolean;
            statistics: any;
            generatedAt: Date;
        };
        performance: {
            success: boolean;
            totalJobs: any;
            measuredJobs: number;
            averageExecutionMs: number;
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
