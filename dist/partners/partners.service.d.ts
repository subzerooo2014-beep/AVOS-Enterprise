import { PrismaService } from "../prisma/prisma.service";
export declare class PartnersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): any;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
}
