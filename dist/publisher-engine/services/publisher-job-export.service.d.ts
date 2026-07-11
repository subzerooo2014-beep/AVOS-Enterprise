import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherJobExportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    export(limit?: number): Promise<{
        success: boolean;
        exported: any;
        jobs: any;
        generatedAt: Date;
    }>;
}
