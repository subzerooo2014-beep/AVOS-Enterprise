import { PrismaService } from "../prisma/prisma.service";
import { AiActionLogService } from "../ai-action-log/ai-action-log.service";
export declare class AiDistributionEngineService {
    private readonly prisma;
    private readonly logs;
    constructor(prisma: PrismaService, logs: AiActionLogService);
    dashboard(): Promise<{
        success: boolean;
        summary: {
            total: any;
            queued: any;
            published: any;
            failed: any;
            channels: Record<string, number>;
        };
        latest: any;
    }>;
    processQueued(limit?: number): Promise<{
        success: boolean;
        processedCount: number;
        processed: any[];
    }>;
    retryFailed(limit?: number): Promise<{
        success: boolean;
        retriedCount: number;
        retried: any[];
    }>;
    channelReport(channel: string): Promise<{
        success: boolean;
        channel: string;
        total: any;
        queued: any;
        published: any;
        failed: any;
        jobs: any;
    }>;
    vehicleReport(vehicleId: string): Promise<{
        success: boolean;
        vehicleId: string;
        total: any;
        queued: any;
        published: any;
        failed: any;
        channels: Record<string, number>;
        jobs: any;
    }>;
    private simulatePublish;
    private channelOf;
    private entityIdOf;
    private groupByChannel;
}
