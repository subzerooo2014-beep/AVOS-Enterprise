import { PrismaService } from "../../prisma/prisma.service";
import { BaseRepository } from "../../common/repositories/base.repository";
export declare class ContractsRepository extends BaseRepository {
    constructor(prisma: PrismaService);
    list(page?: number, limit?: number, where?: any): Promise<any>;
}
