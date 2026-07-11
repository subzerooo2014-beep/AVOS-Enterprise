import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherQueueService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    queued(limit?: number): any;
    processing(limit?: number): any;
    failed(limit?: number): any;
}
