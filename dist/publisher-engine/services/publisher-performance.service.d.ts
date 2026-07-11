import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherPerformanceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    report(): Promise<{
        success: boolean;
        totalJobs: any;
        measuredJobs: number;
        averageExecutionMs: number;
        generatedAt: Date;
    }>;
}
