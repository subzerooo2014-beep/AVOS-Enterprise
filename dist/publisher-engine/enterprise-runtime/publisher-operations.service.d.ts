import { PrismaService } from "../../prisma/prisma.service";
import { SocialDeliveryWorkerService } from "../social-delivery/social-delivery-worker.service";
export declare class PublisherOperationsService {
    private readonly prisma;
    private readonly worker;
    constructor(prisma: PrismaService, worker: SocialDeliveryWorkerService);
    cancel(eventId: string, reason?: string): Promise<{
        success: boolean;
        operation: string;
        eventId: string;
        previousStatus: any;
        status: any;
        cancelledAt: any;
    }>;
    retry(eventId: string, reason?: string): Promise<{
        success: boolean;
        operation: string;
        eventId: string;
        previousStatus: any;
        status: any;
        queuedAt: any;
    }>;
    retryNow(eventId: string, reason?: string): Promise<{
        success: boolean;
        operation: string;
        queued: {
            success: boolean;
            operation: string;
            eventId: string;
            previousStatus: any;
            status: any;
            queuedAt: any;
        };
        dispatch: any;
    }>;
    clone(eventId: string, overrides?: {
        title?: string;
        content?: any;
        campaign?: any;
        metadata?: any;
    }): Promise<{
        success: boolean;
        operation: string;
        sourceEventId: any;
        eventId: any;
        status: any;
        contentVersion: number;
        createdAt: any;
    }>;
    replay(eventId: string, overrides?: {
        content?: any;
        campaign?: any;
        metadata?: any;
    }): Promise<{
        success: boolean;
        operation: string;
        sourceEventId: string;
        cloned: {
            success: boolean;
            operation: string;
            sourceEventId: any;
            eventId: any;
            status: any;
            contentVersion: number;
            createdAt: any;
        };
        dispatch: any;
    }>;
    operationHistory(eventId: string): Promise<{
        success: boolean;
        eventId: any;
        status: any;
        count: number;
        operations: any[];
    }>;
    private event;
    private assertRetryable;
    private updateWithOperation;
    private appendOperation;
    private operationRecord;
    private externalId;
    private audit;
    private supportedEventTypes;
    private objectOf;
}
