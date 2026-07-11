import { AiJobQueueService } from "./ai-job-queue.service";
export declare class AiJobWorkerService {
    private readonly queue;
    private readonly logger;
    private working;
    constructor(queue: AiJobQueueService);
    tick(): Promise<void>;
    processBatch(limit?: number): Promise<{
        success: boolean;
        processedCount: number;
        processed: any[];
    }>;
    private execute;
}
