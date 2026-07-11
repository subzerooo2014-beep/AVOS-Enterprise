import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherStatisticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    summary(): Promise<{
        success: boolean;
        statistics: any;
        generatedAt: Date;
    }>;
}
