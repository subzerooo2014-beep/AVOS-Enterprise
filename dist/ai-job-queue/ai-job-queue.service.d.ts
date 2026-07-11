import { PrismaService } from "../prisma/prisma.service";
export type JobStatus = "queued" | "running" | "completed" | "failed" | "dead";
export declare class AiJobQueueService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    enqueue(type: string, payload: any, priority?: number): Promise<any>;
    queued(limit?: number): Promise<any>;
    failed(limit?: number): Promise<any>;
    mark(id: string, status: JobStatus): Promise<any>;
    retryFailed(limit?: number): Promise<{
        success: boolean;
        retriedCount: number;
        retried: any[];
    }>;
    moveFailedToDead(limit?: number): Promise<{
        success: boolean;
        deadCount: number;
        dead: any[];
    }>;
    cleanupCompleted(limit?: number): Promise<{
        success: boolean;
        deleted: any;
    }>;
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
    private priorityOf;
    private groupBy;
}
