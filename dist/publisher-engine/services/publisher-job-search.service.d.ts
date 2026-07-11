import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherJobSearchService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    search(keyword: string, limit?: number): any;
}
