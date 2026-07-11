import { PublisherVersioningService } from "./publisher-versioning.service";
export declare class PublisherVersioningController {
    private readonly service;
    constructor(service: PublisherVersioningService);
    createVersion(eventId: string, body?: {
        reason?: string;
        content?: any;
        campaign?: any;
        metadata?: any;
    }): Promise<{
        success: boolean;
        duplicate: boolean;
        eventId: string;
        version: number;
        versionId: string;
        contentHash: string;
        message: string;
        activeVersion?: undefined;
        createdAt?: undefined;
    } | {
        success: boolean;
        duplicate: boolean;
        eventId: any;
        version: number;
        versionId: string;
        contentHash: string;
        activeVersion: any;
        createdAt: string;
        message?: undefined;
    }>;
    versions(eventId: string): Promise<{
        success: boolean;
        eventId: any;
        activeVersion: number;
        activeVersionId: any;
        count: number;
        versions: {
            versionId: string;
            version: number;
            contentHash: string;
            reason: string | null;
            createdAt: string;
            source: string;
        }[];
    }>;
    version(eventId: string, version: string): Promise<{
        success: boolean;
        eventId: any;
        version: import("./publisher-versioning.service").PublicationVersion;
    }>;
    compare(eventId: string, left: string, right: string): Promise<{
        success: boolean;
        eventId: any;
        leftVersion: number;
        rightVersion: number;
        changed: boolean;
        changes: any[];
        left: {
            versionId: string;
            contentHash: string;
            createdAt: string;
        };
        right: {
            versionId: string;
            contentHash: string;
            createdAt: string;
        };
    }>;
    restore(eventId: string, version: string, body?: {
        reason?: string;
    }): Promise<{
        success: boolean;
        eventId: any;
        previousStatus: any;
        status: any;
        restoredVersion: number;
        restoredVersionId: string;
        contentHash: string;
        restoredAt: Date;
    }>;
    restoreHistory(eventId: string): Promise<{
        success: boolean;
        eventId: any;
        count: number;
        restores: any[];
    }>;
}
