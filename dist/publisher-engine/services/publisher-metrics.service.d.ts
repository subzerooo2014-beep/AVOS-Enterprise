import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherMetricsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    summary(): Promise<{
        success: boolean;
        engine: string;
        statuses: any;
        generatedAt: Date;
    }>;
}
