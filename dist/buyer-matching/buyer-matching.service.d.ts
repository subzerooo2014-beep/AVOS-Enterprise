import { PrismaService } from "../prisma/prisma.service";
export declare class BuyerMatchingService {
    private prisma;
    constructor(prisma: PrismaService);
    private clamp;
    createLead(data: any): Promise<any>;
    listLeads(): any;
    matchBuyer(leadId: string, data: any): Promise<any>;
    listMatches(): any;
}
