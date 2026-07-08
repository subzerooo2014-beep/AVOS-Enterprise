import { VehiclesService } from "../services/vehicles.service";
export declare class VehiclesController {
    private readonly vehicles;
    constructor(vehicles: VehiclesService);
    create(body: any): import("@prisma/client").Prisma.Prisma__VehicleClient<{
        model: string;
        make: string;
        year: number;
        color: string | null;
        vin: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        inventory: {
            status: string;
            location: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            vehicleId: string;
            price: number | null;
        } | null;
    } & {
        model: string;
        make: string;
        year: number;
        color: string | null;
        vin: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        inventory: {
            status: string;
            location: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            vehicleId: string;
            price: number | null;
        } | null;
    } & {
        model: string;
        make: string;
        year: number;
        color: string | null;
        vin: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, body: any): import("@prisma/client").Prisma.Prisma__VehicleClient<{
        model: string;
        make: string;
        year: number;
        color: string | null;
        vin: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__VehicleClient<{
        model: string;
        make: string;
        year: number;
        color: string | null;
        vin: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
