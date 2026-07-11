import { PrismaService } from "../prisma/prisma.service";
export declare class AiCoreService {
    private prisma;
    constructor(prisma: PrismaService);
    createAgent(data: any): any;
    listAgents(): any;
    createEvent(data: any): any;
    listEvents(): any;
    explainDecision(data: any): Promise<any>;
}
