import { PrismaService } from "../prisma/prisma.service";
export declare class AvosKernelService {
    private prisma;
    constructor(prisma: PrismaService);
    private clamp;
    decide(data: any): Promise<any>;
    list(): any;
}
