import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherTimelineService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    timeline(limit?: number): Promise<{
        success: boolean;
        events: any;
    }>;
}
