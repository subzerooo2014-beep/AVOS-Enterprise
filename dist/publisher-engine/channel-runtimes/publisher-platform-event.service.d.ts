import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherPlatformEventService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: {
        type: string;
        source: string;
        entityType?: string;
        entityId?: string;
        status?: string;
        payload?: any;
        result?: any;
    }): Promise<any>;
}
