import { PublisherOperationsService } from "./publisher-operations.service";
export declare class PublisherOperationsController {
    private readonly service;
    constructor(service: PublisherOperationsService);
    cancel(eventId: string, body?: {
        reason?: string;
    }): Promise<{
        success: boolean;
        operation: string;
        eventId: string;
        previousStatus: any;
        status: any;
        cancelledAt: any;
    }>;
    retry(eventId: string, body?: {
        reason?: string;
    }): Promise<{
        success: boolean;
        operation: string;
        eventId: string;
        previousStatus: any;
        status: any;
        queuedAt: any;
    }>;
    retryNow(eventId: string, body?: {
        reason?: string;
    }): Promise<{
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
    clone(eventId: string, body?: {
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
    replay(eventId: string, body?: {
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
    history(eventId: string): Promise<{
        success: boolean;
        eventId: any;
        status: any;
        count: number;
        operations: any[];
    }>;
}
