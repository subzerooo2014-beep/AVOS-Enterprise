import { Injectable } from "@nestjs/common";
import { EventBusService } from "../../../event-bus/event-bus.service";
import { CancelReservationCommand } from "./dto/cancel-reservation.command";
import { CancelReservationResponse } from "./dto/cancel-reservation.response";
import { CancelReservationPolicy } from "./domain/cancel-reservation.policy";
import { CancelReservationDomainService } from "./domain/cancel-reservation.domain-service";
import { CancelReservationRepository } from "./infrastructure/cancel-reservation.repository";

@Injectable()
export class CancelReservationHandler {

  constructor(
    private readonly policy:CancelReservationPolicy,
    private readonly domain:CancelReservationDomainService,
    private readonly repository:CancelReservationRepository,
    private readonly eventBus:EventBusService
  ){}

  async execute(
    command:CancelReservationCommand
  ):Promise<CancelReservationResponse>{

    const result = await this.repository.transaction(async(tx)=>{

      const reservation = await this.repository.findReservation(
        tx,
        command.reservationId
      );

      this.domain.ensureReservationExists(reservation);

      this.policy.ensureCanCancel(
        reservation!.status ?? "ACTIVE"
      );

      const inventory = reservation!.inventory;
      const vehicle = inventory?.vehicle;

      if(!inventory || !vehicle){
        throw new Error("Reservation inventory or vehicle is missing");
      }

      const cancelledReservation = await this.repository.cancelReservation(
        tx,
        reservation!.id,
        command.reason
      );

      const releasedInventory = await this.repository.releaseInventory(
        tx,
        inventory.id
      );

      const releasedVehicle = await this.repository.releaseVehicle(
        tx,
        vehicle.id
      );

      await this.repository.createMovement(
        tx,
        releasedInventory.id,
        releasedInventory.warehouseId,
        cancelledReservation.id
      );

      await this.repository.createAudit(
        tx,
        cancelledReservation.id
      );

      return {
        reservation:cancelledReservation,
        inventory:releasedInventory,
        vehicle:releasedVehicle,
        cancelledAt:new Date()
      };

    });

    this.eventBus.publish("ReservationCancelled",{
      reservationId:result.reservation.id,
      inventoryId:result.inventory.id,
      vehicleId:result.vehicle.id,
      reason:command.reason
    });

    return {
      reservationId:result.reservation.id,
      inventoryId:result.inventory.id,
      vehicleId:result.vehicle.id,
      status:result.reservation.status ?? "CANCELLED",
      cancelledAt:result.cancelledAt
    };

  }

}
