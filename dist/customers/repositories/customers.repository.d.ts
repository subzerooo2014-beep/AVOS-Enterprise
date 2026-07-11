import { PrismaService } from "../../prisma/prisma.service";
import { BaseRepository } from "../../common/repositories/base.repository";
export declare class CustomersRepository extends BaseRepository {
    constructor(prisma: PrismaService);
    findCustomers(where?: any): any;
    paginateCustomers(page?: number, limit?: number, where?: any): Promise<{
        data: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
    findCustomerById(id: string): any;
    createCustomer(data: any): any;
    updateCustomer(id: string, data: any): any;
    deleteCustomer(id: string): any;
    countCustomers(where?: any): any;
}
