import { AiDistributionEngineService } from "./ai-distribution-engine.service";
export declare class AiDistributionEngineController {
    private readonly service;
    constructor(service: AiDistributionEngineService);
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
    processQueued(limit?: string): Promise<{
        success: boolean;
        processedCount: number;
        processed: any[];
    }>;
    retryFailed(limit?: string): Promise<{
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
    vehicleReport(id: string): Promise<{
        success: boolean;
        vehicleId: string;
        total: any;
        queued: any;
        published: any;
        failed: any;
        channels: Record<string, number>;
        jobs: any;
    }>;
}
