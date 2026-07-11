import { PrismaService } from "../prisma/prisma.service";
export declare class AvosDnaService {
    private prisma;
    constructor(prisma: PrismaService);
    seedDefaults(): Promise<any[]>;
    list(): any;
}
