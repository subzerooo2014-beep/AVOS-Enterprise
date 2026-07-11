import { PrismaService } from "../prisma/prisma.service";
export declare class ExportTradeService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): any;
    findAll(): any;
    findOne(id: string): Promise<any>;
    scoreExportReadiness(id: string): Promise<any>;
}
