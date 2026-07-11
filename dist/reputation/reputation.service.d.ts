import { PrismaService } from "../prisma/prisma.service";
export declare class ReputationService {
    private prisma;
    constructor(prisma: PrismaService);
    private clamp;
    snapshot(entityType: string, entityId: string, metrics?: any): Promise<any>;
    timeline(entityType: string, entityId: string): any;
    list(): any;
}
