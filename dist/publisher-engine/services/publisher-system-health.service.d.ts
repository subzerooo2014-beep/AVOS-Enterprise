import { PublisherHealthMonitorService } from "./publisher-health-monitor.service";
import { PublisherQueueMonitorService } from "./publisher-queue-monitor.service";
export declare class PublisherSystemHealthService {
    private readonly health;
    private readonly queue;
    constructor(health: PublisherHealthMonitorService, queue: PublisherQueueMonitorService);
    report(): Promise<{
        success: boolean;
        health: {
            success: boolean;
            engine: string;
            channels: {
                channel: string;
                status: import("..").PublisherStatus;
            }[];
            checkedAt: Date;
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
        timestamp: Date;
    }>;
}
