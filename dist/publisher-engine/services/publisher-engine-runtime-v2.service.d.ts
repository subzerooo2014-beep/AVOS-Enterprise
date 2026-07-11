import { PublisherRuntimeDashboardService } from "./publisher-runtime-dashboard.service";
import { PublisherQueueRuntimeService } from "./publisher-queue-runtime.service";
export declare class PublisherEngineRuntimeV2Service {
    private readonly dashboard;
    private readonly queue;
    constructor(dashboard: PublisherRuntimeDashboardService, queue: PublisherQueueRuntimeService);
    status(): Promise<{
        success: boolean;
        dashboard: {
            workers: {
                success: boolean;
                workers: {
                    id: string;
                    lastSeen: Date;
                }[];
                generatedAt: Date;
            };
            executions: any[];
            generatedAt: Date;
        };
        queue: {
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
        };
        generatedAt: Date;
    }>;
}
