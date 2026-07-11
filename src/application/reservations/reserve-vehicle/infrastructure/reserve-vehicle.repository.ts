import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../prisma/prisma.service";

type Tx = Prisma.TransactionClient;

@Injectable()
export class ReserveVehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  transaction<T>(fn: (tx: Tx) => Promise<T>) {
    return this.prisma.$transaction(fn);
  }

  findVehicleWithInventory(tx: Tx, vehicleId: string) {
    return tx.vehicle.findUnique({
      where: { id: vehicleId },
      include: { inventory: true },
    });
  }

  createReservation(
    tx: Tx,
    data: {
      inventoryId: string;
      customerId: string;
      status: string;
      expiresAt: Date;
      notes?: string;
    },
  ) {
    return tx.reservation.create({ data });
  }

  reserveInventory(tx: Tx, inventoryId: string) {
    return tx.inventory.update({
      where: { id: inventoryId },
      data: {
        status: "RESERVED",
        reserved: true,
        reservedAt: new Date(),
      },
    });
  }

  reserveVehicle(tx: Tx, vehicleId: string) {
    return tx.vehicle.update({
      where: { id: vehicleId },
      data: { status: "RESERVED" },
    });
  }

  createStockMovement(
    tx: Tx,
    data: {
      inventoryId: string;
      warehouseId?: string | null;
      reservationId: string;
      notes?: string;
    },
  ) {
    return tx.stockMovement.create({
      data: {
        inventoryId: data.inventoryId,
        warehouseId: data.warehouseId,
        type: "RESERVATION",
        quantity: 1,
        reference: data.reservationId,
        reason: "Vehicle reserved",
        notes: data.notes,
        status: "POSTED",
      },
    });
  }

  createAuditLog(
    tx: Tx,
    data: {
      reservationId: string;
    },
  ) {
    return tx.auditLog.create({
      data: {
        action: "VEHICLE_RESERVED",
        entity: "Reservation",
        entityId: data.reservationId,
      },
    });
  }
}
