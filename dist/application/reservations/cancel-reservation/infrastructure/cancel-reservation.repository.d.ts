import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../prisma/prisma.service";
type Tx = Prisma.TransactionClient;
export declare class CancelReservationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    transaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T>;
    findReservation(tx: Tx, reservationId: string): Prisma.Prisma__ReservationClient<({
        inventory: ({
            vehicle: {
                id: string;
                status: string;
                createdAt: Date;
                year: number;
                make: string;
                model: string;
                location: string | null;
                color: string | null;
                vin: string;
                brandId: string | null;
                updatedAt: Date;
                vehicleModelId: string | null;
                trimId: string | null;
                dealerId: string | null;
                showroomId: string | null;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            reserved: boolean;
            reservedAt: Date | null;
            vehicleId: string;
            price: number | null;
            location: string | null;
            updatedAt: Date;
            notes: string | null;
            stockNumber: string | null;
            warehouseId: string | null;
            receivedAt: Date | null;
        }) | null;
    } & {
        id: string;
        name: string | null;
        status: string | null;
        createdAt: Date;
        code: string | null;
        updatedAt: Date;
        notes: string | null;
        customerId: string | null;
        expiresAt: Date | null;
        inventoryId: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    cancelReservation(tx: Tx, reservationId: string, reason?: string): Prisma.Prisma__ReservationClient<{
        id: string;
        name: string | null;
        status: string | null;
        createdAt: Date;
        code: string | null;
        updatedAt: Date;
        notes: string | null;
        customerId: string | null;
        expiresAt: Date | null;
        inventoryId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    releaseInventory(tx: Tx, inventoryId: string): Prisma.Prisma__InventoryClient<{
        id: string;
        status: string;
        createdAt: Date;
        reserved: boolean;
        reservedAt: Date | null;
        vehicleId: string;
        price: number | null;
        location: string | null;
        updatedAt: Date;
        notes: string | null;
        stockNumber: string | null;
        warehouseId: string | null;
        receivedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    releaseVehicle(tx: Tx, vehicleId: string): Prisma.Prisma__VehicleClient<{
        id: string;
        status: string;
        createdAt: Date;
        year: number;
        make: string;
        model: string;
        location: string | null;
        color: string | null;
        vin: string;
        brandId: string | null;
        updatedAt: Date;
        vehicleModelId: string | null;
        trimId: string | null;
        dealerId: string | null;
        showroomId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createMovement(tx: Tx, inventoryId: string, warehouseId: string | null, reservationId: string): Prisma.Prisma__StockMovementClient<{
        id: string;
        type: string;
        name: string | null;
        reason: string | null;
        status: string | null;
        createdAt: Date;
        code: string | null;
        updatedAt: Date;
        notes: string | null;
        inventoryId: string | null;
        warehouseId: string | null;
        quantity: number;
        reference: string | null;
        createdById: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createAudit(tx: Tx, reservationId: string): Prisma.Prisma__AuditLogClient<{
        id: string;
        action: string;
        createdAt: Date;
        entity: string | null;
        entityId: string | null;
        userId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
export {};
