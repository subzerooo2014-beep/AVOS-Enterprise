import { PrismaService } from "../prisma/prisma.service";
export declare class PurchaseOrdersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private get model();
    findAll(): any;
    findOne(id: string): any;
    create(data: any): any;
    update(id: string, data: any): any;
}
