import { PrismaService } from "../prisma/prisma.service";
export declare class MarketingEngineService {
    private prisma;
    constructor(prisma: PrismaService);
    private clamp;
    createCampaign(data: any): Promise<any>;
    listCampaigns(): any;
    findCampaign(id: string): Promise<any>;
    generateAd(campaignId: string, data?: any): Promise<any>;
    optimizeCampaign(id: string, metrics?: any): Promise<any>;
    createPublishingPlan(campaignId: string, data: any): Promise<any>;
}
