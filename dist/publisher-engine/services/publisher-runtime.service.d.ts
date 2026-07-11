import { PublisherEngineStatusService } from "./publisher-engine-status.service";
import { PublisherQueueMonitorService } from "./publisher-queue-monitor.service";
export declare class PublisherRuntimeService {
    private readonly statusService;
    private readonly queueService;
    constructor(statusService: PublisherEngineStatusService, queueService: PublisherQueueMonitorService);
    runtime(): Promise<{
        status: {
            engine: string;
            version: string;
            status: string;
            timestamp: Date;
        };
        queue: {
            success: boolean;
            queue: {
                queued: number;
                processing: number;
                published: number;
                failed: number;
                dead: number;
                skipped: number;
            };
            total: any;
            generatedAt: Date;
        };
        generatedAt: Date;
    }>;
}
