import { PrismaService } from "../prisma/prisma.service";
import { VehicleSearchDto } from "./dto/vehicle-search.dto";
export declare class VehicleSearchService {
    private prisma;
    constructor(prisma: PrismaService);
    search(dto: VehicleSearchDto): any;
}
