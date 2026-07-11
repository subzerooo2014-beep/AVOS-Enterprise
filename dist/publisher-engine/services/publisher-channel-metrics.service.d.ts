import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherChannelMetricsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    summary(): Promise<{
        success: boolean;
        channels: Record<string, any>;
        generatedAt: Date;
    }>;
}
