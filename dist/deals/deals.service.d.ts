import { PrismaService } from "../prisma/prisma.service";
export declare class DealsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): any;
    findAll(): any;
    findOne(id: string): Promise<any>;
    calculateDealScore(id: string): Promise<any>;
    calculateCommission(id: string, amount: number, percent?: number): Promise<any>;
}
