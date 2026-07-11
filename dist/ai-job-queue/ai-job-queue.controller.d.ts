import { AiJobQueueService } from "./ai-job-queue.service";
import { AiJobWorkerService } from "./ai-job-worker.service";
export declare class AiJobQueueController {
    private readonly service;
    private readonly worker;
    constructor(service: AiJobQueueService, worker: AiJobWorkerService);
    enqueue(body: any): Promise<any>;
    queued(limit?: string): Promise<any>;
    dashboard(): Promise<{
        success: boolean;
        total: any;
        queued: any;
        running: any;
        completed: any;
        failed: any;
        dead: any;
        byType: Record<string, number>;
        workerHealth: {
            mode: string;
            status: string;
            maxBatch: number;
            autoTickMs: number;
        };
        latest: any;
    }>;
    process(limit?: string): Promise<{
        success: boolean;
        processedCount: number;
        processed: any[];
    }>;
    retryFailed(limit?: string): Promise<{
        success: boolean;
        retriedCount: number;
        retried: any[];
    }>;
    deadLetter(limit?: string): Promise<{
        success: boolean;
        deadCount: number;
        dead: any[];
    }>;
    cleanup(limit?: string): Promise<{
        success: boolean;
        deleted: any;
    }>;
}
