import { PrismaService } from "../prisma/prisma.service";
export declare class ExportAdvisorService {
    private prisma;
    constructor(prisma: PrismaService);
    private clamp;
    advise(data: any): Promise<any>;
    list(): any;
}
