import { PrismaService } from "../../prisma/prisma.service";
import { BaseRepository } from "../../common/repositories/base.repository";
export declare class CustomersRepository extends BaseRepository {
    constructor(prisma: PrismaService);
    paginateCustomers(page?: number, limit?: number, where?: any): Promise<{
        data: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
}
