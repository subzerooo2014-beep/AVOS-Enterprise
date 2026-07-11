import { PrismaService } from "../prisma/prisma.service";
export declare class AiResultsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getVehicleResults(vehicleId: string): Promise<any>;
}
