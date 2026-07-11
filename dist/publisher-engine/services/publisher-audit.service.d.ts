import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherAuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    write(action: string, job: any, payload?: any): Promise<any>;
}
