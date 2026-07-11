import { PublisherAdvancedAnalyticsService } from "./publisher-advanced-analytics.service";
export declare class PublisherAdvancedAnalyticsController {
    private readonly service;
    constructor(service: PublisherAdvancedAnalyticsService);
    dashboard(dateFrom?: string, dateTo?: string, channel?: string): Promise<{
        success: boolean;
        window: {
            label: string;
            from: Date;
            to: Date;
        };
        filters: {
            channel: string | null;
        };
        overview: {
            totalPublications: number;
            delivered: number;
            failed: number;
            queued: number;
            processing: number;
            cancelled: number;
            rejected: number;
            awaitingCredentials: number;
            successRate: number;
            averageAttempts: number;
            averageDeliveryDurationMs: number;
            receiptCoverageRate: number;
            versionedPublicationRate: number;
        };
        channels: {
            channel: any;
            total: any;
            delivered: any;
            failed: any;
            queued: any;
            processing: any;
            cancelled: any;
            rejected: any;
            awaitingCredentials: any;
            successRate: number;
            averageAttempts: number;
            averageDeliveryDurationMs: number;
            receiptCount: any;
            versionCount: any;
            operationCount: any;
        }[];
        statuses: Record<string, number>;
        retries: {
            totalAttempts: number;
            averageAttempts: number;
            retryOperations: number;
        };
        versions: {
            totalVersions: number;
            versionedEvents: number;
            versionedPublicationRate: number;
            restoreOperations: number;
        };
        receipts: {
            totalReceipts: number;
            eventsWithReceipts: number;
            coverageRate: number;
        };
        operations: {
            totalOperations: number;
            cloneOperations: number;
            replayOperations: number;
            retryOperations: number;
            cancelOperations: number;
            restoreOperations: number;
        };
        generatedAt: Date;
    }>;
    kpis(dateFrom?: string, dateTo?: string): Promise<{
        success: boolean;
        window: {
            from: Date;
            to: Date;
        };
        kpis: {
            totalPublications: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            delivered: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            failed: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            successRate: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            averageDeliveryDurationMs: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            averageAttempts: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            receiptCoverageRate: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
            versionedPublicationRate: {
                current: number;
                previous: number;
                changePercent: number;
                trend: string;
                improved: boolean | null;
            };
        };
        generatedAt: Date;
    }>;
    channelPerformance(dateFrom?: string, dateTo?: string): Promise<{
        success: boolean;
        window: {
            from: Date;
            to: Date;
        };
        channels: {
            channel: any;
            total: any;
            delivered: any;
            failed: any;
            queued: any;
            processing: any;
            cancelled: any;
            rejected: any;
            awaitingCredentials: any;
            successRate: number;
            averageAttempts: number;
            averageDeliveryDurationMs: number;
            receiptCount: any;
            versionCount: any;
            operationCount: any;
        }[];
        bestChannel: {
            channel: any;
            total: any;
            delivered: any;
            failed: any;
            queued: any;
            processing: any;
            cancelled: any;
            rejected: any;
            awaitingCredentials: any;
            successRate: number;
            averageAttempts: number;
            averageDeliveryDurationMs: number;
            receiptCount: any;
            versionCount: any;
            operationCount: any;
        } | null;
        generatedAt: Date;
    }>;
}
