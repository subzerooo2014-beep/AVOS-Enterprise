import { Injectable } from "@nestjs/common";
import { VehicleNotAvailableException } from "./reserve-vehicle.errors";

@Injectable()
export class ReserveVehiclePolicy {
  ensureInventoryAvailable(inventory: { status: string; reserved: boolean }) {
    if (inventory.reserved || inventory.status !== "AVAILABLE") {
      throw new VehicleNotAvailableException();
    }
  }

  createExpiryDate() {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    return expiresAt;
  }
}
