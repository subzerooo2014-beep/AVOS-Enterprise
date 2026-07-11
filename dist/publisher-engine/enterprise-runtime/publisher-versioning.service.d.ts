import { PrismaService } from "../../prisma/prisma.service";
export interface PublicationVersion {
    versionId: string;
    version: number;
    contentHash: string;
    snapshot: any;
    reason: string | null;
    createdAt: string;
    source: string;
}
export declare class PublisherVersioningService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createVersion(eventId: string, input?: {
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
    version(eventId: string, versionNumber: number): Promise<{
        success: boolean;
        eventId: any;
        version: PublicationVersion;
    }>;
    compare(eventId: string, leftVersion: number, rightVersion: number): Promise<{
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
    restore(eventId: string, versionNumber: number, reason?: string): Promise<{
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
    private snapshotOf;
    private versionsOf;
    private hash;
    private stableStringify;
    private diff;
    private event;
    private objectOf;
    private audit;
}
