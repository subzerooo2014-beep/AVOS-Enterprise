import { PrismaService } from "../prisma/prisma.service";
export declare class WalletsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): any;
    create(dto: any): any;
}
