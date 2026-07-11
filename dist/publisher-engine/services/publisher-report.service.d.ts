import { PublisherStatisticsService } from "./publisher-statistics.service";
import { PublisherPerformanceService } from "./publisher-performance.service";
import { PublisherChannelMetricsService } from "./publisher-channel-metrics.service";
export declare class PublisherReportService {
    private readonly statistics;
    private readonly performance;
    private readonly channels;
    constructor(statistics: PublisherStatisticsService, performance: PublisherPerformanceService, channels: PublisherChannelMetricsService);
    report(): Promise<{
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
        generatedAt: Date;
    }>;
}
