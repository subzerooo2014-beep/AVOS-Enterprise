import { PrismaService } from "../prisma/prisma.service";
export declare class AvosIntegrationService {
    private prisma;
    constructor(prisma: PrismaService);
    private clamp;
    vehicleCreated(data: any): Promise<any>;
    listRuns(): any;
}
