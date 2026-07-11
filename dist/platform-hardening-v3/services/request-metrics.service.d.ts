import { MetricsSnapshot } from "../interfaces/metrics-snapshot.interface";
import { RequestMetric } from "../interfaces/request-metric.interface";
export declare class RequestMetricsService {
    private readonly startedAt;
    private readonly recentMetrics;
    private totalRequests;
    private successfulRequests;
    private failedRequests;
    private slowRequests;
    private totalDurationMs;
    private maximumDurationMs;
    private minimumDurationMs;
    private readonly statusCodes;
    private readonly methods;
    private readonly paths;
    record(metric: RequestMetric): void;
    getSnapshot(): MetricsSnapshot;
    getRecent(limit?: number): RequestMetric[];
    private normalizePath;
}
