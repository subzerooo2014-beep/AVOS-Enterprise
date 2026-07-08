import { PrismaService } from "../../prisma/prisma.service";
export declare class TransactionManagerService {
    private prisma;
    constructor(prisma: PrismaService);
    run<T>(handler: (tx: any) => Promise<T>): Promise<any[]>;
}
