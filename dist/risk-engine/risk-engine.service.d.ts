import { PrismaService } from "../prisma/prisma.service";
export declare class RiskEngineService {
    private prisma;
    constructor(prisma: PrismaService);
    private clamp;
    private level;
    assess(entityType: string, entityId: string, factors?: any): Promise<any>;
    list(): any;
}
