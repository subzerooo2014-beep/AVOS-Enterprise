import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherStatsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    byChannel(): Promise<{
        success: boolean;
        channels: Record<string, any>;
    }>;
}
