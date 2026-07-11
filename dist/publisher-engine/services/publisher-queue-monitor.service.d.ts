import { PrismaService } from "../../prisma/prisma.service";
type QueueCounters = {
    queued: number;
    processing: number;
    published: number;
    failed: number;
    dead: number;
    skipped: number;
};
export declare class PublisherQueueMonitorService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    summary(): Promise<{
        success: boolean;
        queue: QueueCounters;
        total: any;
        generatedAt: Date;
    }>;
}
export {};
