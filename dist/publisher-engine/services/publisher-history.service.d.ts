import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherHistoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    latest(limit?: number): any;
    byCampaign(campaignId: string): any;
}
