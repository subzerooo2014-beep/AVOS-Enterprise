import { PrismaService } from "../prisma/prisma.service";
export declare class TaxesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): any;
    create(dto: any): any;
}
