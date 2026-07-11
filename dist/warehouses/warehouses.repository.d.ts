import { PrismaService } from "../prisma/prisma.service";
export declare class WarehousesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private get model();
    findAll(): any;
    findById(id: string): any;
    create(data: any): any;
    update(id: string, data: any): any;
}
