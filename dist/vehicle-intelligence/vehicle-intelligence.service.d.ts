import { PrismaService } from "../prisma/prisma.service";
export declare class VehicleIntelligenceService {
    private prisma;
    constructor(prisma: PrismaService);
    private clamp;
    valueVehicle(data: any): Promise<any>;
    listValuations(): any;
}
