import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherCleanupService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    removeSkipped(days?: number): Promise<{
        success: boolean;
        removed: any;
    }>;
}
