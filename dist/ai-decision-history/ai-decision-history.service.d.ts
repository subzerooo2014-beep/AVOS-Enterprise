import { PrismaService } from "../prisma/prisma.service";
export declare class AiDecisionHistoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    saveDecision(vehicleId: string, decision: any): Promise<any>;
    getHistory(vehicleId: string): Promise<any>;
}
