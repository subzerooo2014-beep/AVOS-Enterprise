import { PrismaService } from "../prisma/prisma.service";
export declare class CalendarService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): any;
    create(dto: any): any;
}
