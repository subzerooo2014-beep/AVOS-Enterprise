import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherRetryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    retryable(limit?: number): Promise<any>;
    enqueue(job: any): Promise<any>;
}
