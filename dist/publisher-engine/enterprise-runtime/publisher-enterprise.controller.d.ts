import { PublisherEnterpriseService } from "./publisher-enterprise.service";
export declare class PublisherEnterpriseController {
    private readonly service;
    constructor(service: PublisherEnterpriseService);
    deliveries(channel?: string, status?: string, vehicleId?: string, correlationId?: string, dateFrom?: string, dateTo?: string, limit?: string): Promise<{
        success: boolean;
        count: any;
        deliveries: any;
        generatedAt: Date;
    }>;
    timeline(eventId: string): Promise<{
        success: boolean;
        eventId: any;
        channel: string | null;
        currentStatus: any;
        timeline: any[];
    }>;
    snapshot(eventId: string): Promise<{
        success: boolean;
        eventId: any;
        snapshot: {
            capturedAt: any;
            vehicle: any;
            content: any;
            campaign: any;
            publisher: any;
            correlationId: any;
            delivery: any;
            receipts: any[];
        };
    }>;
    analytics(): Promise<{
        success: boolean;
        totals: {
            publications: any;
            delivered: any;
            failed: any;
            averageDeliveryDurationMs: number;
        };
        byStatus: Record<string, number>;
        channels: any[];
        generatedAt: Date;
    }>;
}
