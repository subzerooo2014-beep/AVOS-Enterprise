import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherDeadLetterService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    move(job: any, error?: unknown): Promise<any>;
    private publishJobDelegate;
    private channelOf;
    private errorMessage;
}
