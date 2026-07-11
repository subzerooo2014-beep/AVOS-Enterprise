import { PrismaService } from "../prisma/prisma.service";
export declare class TrustService {
    private prisma;
    constructor(prisma: PrismaService);
    calculate(entityType: string, entityId: string, factors?: any): Promise<any>;
    list(): any;
}
