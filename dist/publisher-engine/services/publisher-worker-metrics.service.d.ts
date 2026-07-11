import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherWorkerMetricsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    summary(): Promise<{
        success: boolean;
        workers: Record<string, any>;
        generatedAt: Date;
    }>;
}
