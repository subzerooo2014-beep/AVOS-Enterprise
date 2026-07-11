import { Injectable } from "@nestjs/common";
import { ReserveVehicleCommand } from "./dto/reserve-vehicle.command";
import { ReserveVehicleResponse } from "./dto/reserve-vehicle.response";
import { ReserveVehiclePolicy } from "./domain/reserve-vehicle.policy";
import { ReserveVehicleDomainService } from "./domain/reserve-vehicle.domain-service";
import { ReserveVehicleRepository } from "./infrastructure/reserve-vehicle.repository";
import { EventBusService } from "../../../event-bus/event-bus.service";

@Injectable()
export class ReserveVehicleHandler {
  constructor(
    private readonly policy: ReserveVehiclePolicy,
    private readonly domain: ReserveVehicleDomainService,
    private readonly repository: ReserveVehicleRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async execute(command: ReserveVehicleCommand): Promise<ReserveVehicleResponse> {
    const expiresAt = this.policy.createExpiryDate();

    const result = await this.repository.transaction(async (tx) => {
      const vehicle = await this.repository.findVehicleWithInventory(
        tx,
        command.vehicleId,
      );

      this.domain.ensureVehicleExists(vehicle);
      this.domain.ensureInventoryExists(vehicle!.inventory);

      const inventory = vehicle!.inventory!;

      this.domain.ensureCanReserve({
        vehicleStatus: vehicle!.status,
        inventoryStatus: inventory.status,
        inventoryReserved: inventory.reserved,
      });

      const reservation = await this.repository.createReservation(tx, {
        inventoryId: inventory.id,
        customerId: command.customerId,
        status: "ACTIVE",
        expiresAt,
        notes: command.notes,
      });

      const updatedInventory = await this.repository.reserveInventory(
        tx,
        inventory.id,
      );

      const updatedVehicle = await this.repository.reserveVehicle(
        tx,
        vehicle!.id,
      );

      await this.repository.createStockMovement(tx, {
        inventoryId: updatedInventory.id,
        warehouseId: updatedInventory.warehouseId,
        reservationId: reservation.id,
        notes: command.notes,
      });

      await this.repository.createAuditLog(tx, {
        reservationId: reservation.id,
      });

      return {
        reservation,
        inventory: updatedInventory,
        vehicle: updatedVehicle,
      };
    });

    this.eventBus.publish("VehicleReserved", {
      reservationId: result.reservation.id,
      vehicleId: result.vehicle.id,
      inventoryId: result.inventory.id,
      customerId: command.customerId,
    });

    return {
      reservationId: result.reservation.id,
      inventoryId: result.inventory.id,
      vehicleId: result.vehicle.id,
      customerId: command.customerId,
      status: result.reservation.status ?? "ACTIVE",
      expiresAt: result.reservation.expiresAt,
    };
  }
}
