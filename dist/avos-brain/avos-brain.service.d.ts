import { PrismaService } from "../prisma/prisma.service";
import { AiRuntimeService } from "../ai-runtime/ai-runtime.service";
export declare class AvosBrainService {
    private readonly prisma;
    private readonly aiRuntime;
    constructor(prisma: PrismaService, aiRuntime: AiRuntimeService);
    private processTask;
    processQueued(limit?: number): Promise<{
        processed: number;
        results: any[];
    }>;
    processEvent(eventId: string): Promise<{
        processed: number;
        results: any[];
    }>;
    processLatest(limit?: number): Promise<{
        processed: number;
        results: any[];
    }>;
    listTasks(status?: string): any;
    completeTask(id: string, output?: any): Promise<any>;
}
