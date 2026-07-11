import { PrismaService } from "../../prisma/prisma.service";
export interface ReportingWindow {
    from: Date;
    to: Date;
    label: string;
}
export interface SlaPolicy {
    deliveryTargetMs: number;
    successRateTarget: number;
    receiptCoverageTarget: number;
    maximumAverageAttempts: number;
}
export declare class PublisherReliabilityAnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    slaReport(input?: {
        dateFrom?: string;
        dateTo?: string;
        channel?: string;
    }): Promise<{
        success: boolean;
        window: {
            label: string;
            from: Date;
            to: Date;
        };
        filter: {
            channel: string | null;
        };
        policy: SlaPolicy;
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
    failureTrends(input?: {
        dateFrom?: string;
        dateTo?: string;
        channel?: string;
    }): Promise<{
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
    reliabilityRanking(input?: {
        dateFrom?: string;
        dateTo?: string;
    }): Promise<{
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
    latencyDistribution(input?: {
        dateFrom?: string;
        dateTo?: string;
        channel?: string;
    }): Promise<{
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
    private events;
    private overallMetrics;
    private channelMetrics;
    private reliabilityScore;
    private grade;
    private policy;
    private percentile;
    private deliveryDuration;
    private topEntries;
    private safeErrorText;
    private window;
    private eventTypeForChannel;
    private channelForEventType;
    private publicationEventTypes;
    private date;
    private percent;
    private percentage;
    private positiveInteger;
    private positiveNumber;
    private round;
    private objectOf;
}
