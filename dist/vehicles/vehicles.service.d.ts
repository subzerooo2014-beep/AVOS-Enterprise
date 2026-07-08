import { PrismaService } from "../prisma/prisma.service";
import { VehiclesRepository } from "./repositories/vehicles.repository";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
export declare class VehiclesService {
    private readonly prisma;
    private readonly repository;
    constructor(prisma: PrismaService, repository: VehiclesRepository);
    findAll(query?: any): Promise<{
        items: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    stats(): Promise<{
        total: any;
        available: any;
        sold: any;
        reserved: any;
        generatedAt: string;
    }>;
    findOne(id: string): Promise<any>;
    create(dto: CreateVehicleDto): Promise<any>;
    update(id: string, dto: UpdateVehicleDto): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
