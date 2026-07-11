import { PrismaService } from "../prisma/prisma.service";
export declare class PurchaseOrderItemsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private get model();
    findAll(orderId: string): any;
    create(data: any): any;
}
