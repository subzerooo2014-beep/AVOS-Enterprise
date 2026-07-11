import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherUnlockService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    unlockExpired(minutes?: number): Promise<{
        success: boolean;
        unlocked: number;
        jobs: any[];
    }>;
}
