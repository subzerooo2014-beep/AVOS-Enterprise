import { VehiclesService } from "./vehicles.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
export declare class VehiclesController {
    private readonly service;
    constructor(service: VehiclesService);
    findAll(page?: string, limit?: string, search?: string, make?: string, model?: string, year?: string, color?: string, status?: string, location?: string, sort?: string, order?: "asc" | "desc"): Promise<{
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
