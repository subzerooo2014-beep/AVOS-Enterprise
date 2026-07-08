import { PrismaService } from "../../prisma/prisma.service";
import { BaseRepository } from "../../common/repositories/base.repository";
export declare class LeadsRepository extends BaseRepository {
    constructor(prisma: PrismaService);
    paginateLeads(page?: number, limit?: number, where?: any): Promise<{
        data: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
}
