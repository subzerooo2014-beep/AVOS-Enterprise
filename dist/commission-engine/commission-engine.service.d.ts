import { PrismaService } from "../prisma/prisma.service";
export declare class CommissionEngineService {
    private prisma;
    constructor(prisma: PrismaService);
    createPolicy(data: any): any;
    listPolicies(): any;
    calculate(data: any): Promise<any>;
    listRecords(): any;
}
