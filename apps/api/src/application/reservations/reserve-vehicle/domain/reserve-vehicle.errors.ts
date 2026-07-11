import { BadRequestException, NotFoundException } from "@nestjs/common";

export class VehicleNotFoundException extends NotFoundException {
  constructor() {
    super("Vehicle not found");
  }
}

export class InventoryNotFoundException extends NotFoundException {
  constructor() {
    super("Inventory not found for this vehicle");
  }
}

export class VehicleNotAvailableException extends BadRequestException {
  constructor() {
    super("Vehicle is not available for reservation");
  }
}
