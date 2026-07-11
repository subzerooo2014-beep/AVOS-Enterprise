import { PrismaService } from "../prisma/prisma.service";
export declare class AiActionLogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    write(vehicleId: string, action: string, status: string): Promise<any>;
    history(vehicleId: string): Promise<any>;
}
