import { PublisherReliabilityAnalyticsService } from "./publisher-reliability-analytics.service";
export declare class PublisherReliabilityAnalyticsController {
    private readonly service;
    constructor(service: PublisherReliabilityAnalyticsService);
    sla(dateFrom?: string, dateTo?: string, channel?: string): Promise<{
        success: boolean;
        window: {
            label: string;
            from: Date;
            to: Date;
        };
        filter: {
            channel: string | null;
        };
        policy: import("./publisher-reliability-analytics.service").SlaPolicy;
        overall: {
            sla: {
                deliveryTimeMet: boolean;
                successRateMet: boolean;
                receiptCoverageMet: boolean;
                attemptsMet: boolean;
                compliant: boolean;
            };
            total: any;
            delivered: any;
            failed: any;
            successRate: number;
            receiptCoverageRate: number;
            averageAttempts: number;
            averageDeliveryDurationMs: number;
        };
        channels: any[];
        generatedAt: Date;
    }>;
    failures(dateFrom?: string, dateTo?: string, channel?: string): Promise<{
        success: boolean;
        window: {
            label: string;
            from: Date;
            to: Date;
        };
        channel: string | null;
        totals: {
            failures: number;
            byStatus: Record<string, number>;
        };
        daily: any[];
        topErrorMessages: {
            value: string;
            count: number;
        }[];
        topErrorCodes: {
            value: string;
            count: number;
        }[];
        generatedAt: Date;
    }>;
    ranking(dateFrom?: string, dateTo?: string): Promise<{
        success: boolean;
        window: {
            label: string;
            from: Date;
            to: Date;
        };
        channels: any[];
        bestChannel: any;
        weakestChannel: any;
        generatedAt: Date;
    }>;
    latency(dateFrom?: string, dateTo?: string, channel?: string): Promise<{
        success: boolean;
        window: {
            label: string;
            from: Date;
            to: Date;
        };
        channel: string | null;
        samples: number;
        latency: {
            minimumMs: number;
            maximumMs: number;
            averageMs: number;
            p50Ms: number;
            p90Ms: number;
            p95Ms: number;
            p99Ms: number;
        };
        generatedAt: Date;
    }>;
}
