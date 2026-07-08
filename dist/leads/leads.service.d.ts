import { PrismaService } from "../prisma/prisma.service";
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): any;
    findOne(id: string): Promise<any>;
    create(dto: any): any;
    update(id: string, dto: any): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
