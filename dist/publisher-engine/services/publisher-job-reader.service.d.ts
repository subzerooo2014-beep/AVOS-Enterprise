import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherJobReaderService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findQueued(limit?: number): any;
    findById(id: string): any;
}
