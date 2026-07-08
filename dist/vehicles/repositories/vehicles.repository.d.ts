import { PrismaService } from "../../prisma/prisma.service";
import { BaseRepository } from "../../common/repositories/base.repository";
export declare class VehiclesRepository extends BaseRepository {
    constructor(prisma: PrismaService);
    private normalizePage;
    private normalizeLimit;
    private safeSort;
    findPage(query: {
        page?: number;
        limit?: number;
        search?: string;
        make?: string;
        model?: string;
        year?: number;
        color?: string;
        status?: string;
        location?: string;
        sort?: string;
        order?: "asc" | "desc";
    }): Promise<{
        items: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    findByVin(vin: string): any;
    findById(id: string): any;
    create(data: any): any;
    update(id: string, data: any): any;
    delete(id: string): any;
    stats(): Promise<{
        total: any;
        available: any;
        sold: any;
        reserved: any;
        generatedAt: string;
    }>;
}
