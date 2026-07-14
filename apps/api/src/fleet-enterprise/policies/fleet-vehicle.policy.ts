import { Injectable } from "@nestjs/common";
@Injectable()
export class FleetVehiclePolicy {
  validate(odometer: number, fuelLevel: number) {
    if (odometer < 0) throw new Error("Invalid odometer");
    if (fuelLevel < 0 || fuelLevel > 100) throw new Error("Invalid fuel level");
    return true;
  }
}
