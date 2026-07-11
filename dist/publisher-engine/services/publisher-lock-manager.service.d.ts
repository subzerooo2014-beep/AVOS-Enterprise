import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherLockManagerService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    releaseExpired(minutes?: number): Promise<{
        success: boolean;
        released: number;
    }>;
}
