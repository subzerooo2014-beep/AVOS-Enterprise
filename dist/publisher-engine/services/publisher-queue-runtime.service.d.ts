import { PublisherQueueMonitorService } from "./publisher-queue-monitor.service";
import { PublisherPriorityQueueService } from "./publisher-priority-queue.service";
export declare class PublisherQueueRuntimeService {
    private readonly monitor;
    private readonly queue;
    constructor(monitor: PublisherQueueMonitorService, queue: PublisherPriorityQueueService);
    runtime(limit?: number): Promise<{
        monitor: {
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
        queued: any;
        generatedAt: Date;
    }>;
}
