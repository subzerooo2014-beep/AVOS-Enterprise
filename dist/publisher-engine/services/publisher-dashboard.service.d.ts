import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherDashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    dashboard(): Promise<{
        success: boolean;
        engine: string;
        counters: any;
        latest: any;
        failed: any;
        generatedAt: Date;
    }>;
}
