import { PrismaService } from "../prisma/prisma.service";
export declare class ContractsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private delegate;
    private clean;
    private number;
    findAll(query?: any): any;
    findOne(id: string): Promise<any>;
    create(dto: any): any;
    update(id: string, dto: any): Promise<any>;
    activate(id: string): Promise<any>;
    complete(id: string): Promise<any>;
    cancel(id: string): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
