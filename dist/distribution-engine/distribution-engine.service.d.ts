import { PrismaService } from "../prisma/prisma.service";
export declare class DistributionEngineService {
    private prisma;
    constructor(prisma: PrismaService);
    createChannel(data: any): any;
    listChannels(): any;
    createPublishJob(data: any): Promise<any>;
    listJobs(): any;
    markPublished(id: string, result?: any): Promise<any>;
    autoRepublish(id: string, metrics?: any): Promise<any>;
}
