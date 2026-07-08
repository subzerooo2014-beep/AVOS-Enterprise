import { PrismaService } from "../prisma/prisma.service";
export declare class QuotesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private delegate;
    private clean;
    private number;
    findAll(query?: any): any;
    findOne(id: string): Promise<any>;
    create(dto: any): any;
    update(id: string, dto: any): Promise<any>;
    changeStatus(id: string, status: string): Promise<any>;
    submit(id: string): Promise<any>;
    approve(id: string): Promise<any>;
    reject(id: string): Promise<any>;
    convert(id: string): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
