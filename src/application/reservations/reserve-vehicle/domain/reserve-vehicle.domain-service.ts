import { Injectable } from "@nestjs/common";
import {
  InventoryNotFoundException,
  VehicleNotAvailableException,
  VehicleNotFoundException,
} from "./reserve-vehicle.errors";

@Injectable()
export class ReserveVehicleDomainService {
  ensureVehicleExists(vehicle: unknown) {
    if (!vehicle) {
      throw new VehicleNotFoundException();
    }
  }

  ensureInventoryExists(inventory: unknown) {
    if (!inventory) {
      throw new InventoryNotFoundException();
    }
  }

  ensureCanReserve(input: {
    vehicleStatus: string;
    inventoryStatus: string;
    inventoryReserved: boolean;
  }) {
    if (
      input.vehicleStatus !== "AVAILABLE" ||
      input.inventoryStatus !== "AVAILABLE" ||
      input.inventoryReserved
    ) {
      throw new VehicleNotAvailableException();
    }
  }
}
