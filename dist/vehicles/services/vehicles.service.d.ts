import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";
export declare class VehiclesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.VehicleCreateInput): Prisma.Prisma__VehicleClient<{
        model: string;
        make: string;
        year: number;
        color: string | null;
        vin: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findAll(): Prisma.PrismaPromise<({
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
    update(id: string, data: Prisma.VehicleUpdateInput): Prisma.Prisma__VehicleClient<{
        model: string;
        make: string;
        year: number;
        color: string | null;
        vin: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    remove(id: string): Prisma.Prisma__VehicleClient<{
        model: string;
        make: string;
        year: number;
        color: string | null;
        vin: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
