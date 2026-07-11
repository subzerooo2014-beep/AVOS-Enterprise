import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherPriorityQueueService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    next(limit?: number): any;
}
