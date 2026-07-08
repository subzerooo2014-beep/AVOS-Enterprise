import { PrismaService } from "../../prisma/prisma.service";
import { ICrmRepository } from "../interfaces/i-crm.repository";
export declare class CrmRepository implements ICrmRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private delegate;
    findAll(query?: any): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<any>;
    count(args?: any): Promise<number>;
}
