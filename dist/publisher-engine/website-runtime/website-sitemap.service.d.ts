import { PrismaService } from "../../prisma/prisma.service";
export declare class WebsiteSitemapService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    requestRefresh(vehicleId: string, publicUrl: string, lastModified: Date): Promise<any>;
}
