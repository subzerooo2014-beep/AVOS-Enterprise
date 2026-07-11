import { PrismaService } from "../../prisma/prisma.service";
export declare class PublisherJobWriterService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    update(id: string, data: any): any;
    create(data: any): any;
}
