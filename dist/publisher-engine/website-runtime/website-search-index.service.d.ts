import { PrismaService } from "../../prisma/prisma.service";
export declare class WebsiteSearchIndexService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    upsert(vehicle: any, document: any): Promise<any>;
}
