import { PrismaService } from "../../prisma/prisma.service";
export declare class BaseRepository {
    protected prisma: PrismaService;
    constructor(prisma: PrismaService);
    paginate(model: any, args?: any, page?: number, limit?: number): Promise<{
        data: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
}
