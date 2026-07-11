import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherEventService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(type: string, job: any, payload?: any): Promise<any>;
}
