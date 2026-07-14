import { Injectable } from "@nestjs/common";
@Injectable()
export class DriverAssignmentPolicy {
  validate(input: { trustScore: number; active: boolean; vehicleAvailable: boolean }) {
    if (!input.active) throw new Error("Driver is inactive");
    if (input.trustScore < 40) throw new Error("Driver trust score too low");
    if (!input.vehicleAvailable) throw new Error("Vehicle unavailable");
    return true;
  }
}
