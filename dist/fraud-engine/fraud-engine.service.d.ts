import { PrismaService } from "../prisma/prisma.service";
export declare class FraudEngineService {
    private prisma;
    constructor(prisma: PrismaService);
    private clamp;
    private level;
    addSignal(data: any): Promise<any>;
    assess(data: any): Promise<any>;
    listAssessments(): any;
}
