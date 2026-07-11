import { PrismaService } from "../prisma/prisma.service";
export declare class GrowthEngineService {
    private prisma;
    constructor(prisma: PrismaService);
    private clamp;
    discoverOpportunity(data: any): Promise<any>;
    listOpportunities(): any;
    markOpportunity(id: string, status: string): Promise<any>;
    createSelfMarketingOpportunity(): Promise<any>;
}
