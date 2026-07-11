import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherEnterpriseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    deliveries(query: {
        channel?: string;
        status?: string;
        vehicleId?: string;
        correlationId?: string;
        dateFrom?: string;
        dateTo?: string;
        limit?: number;
    }): Promise<{
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
    private event;
    private deliverySummary;
    private correlationId;
    private eventTypeForChannel;
    private channelForEventType;
    private publicationEventTypes;
    private objectOf;
    private limit;
    private date;
}
