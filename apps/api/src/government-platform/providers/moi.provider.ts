import { Injectable } from "@nestjs/common";
import { VehicleLookupPolicy } from "../policies/vehicle-lookup.policy";
@Injectable()
export class MoiProvider {
  constructor(private readonly policy: VehicleLookupPolicy) {}
  vehicleLookup(vin: string, emirate: string) {
    this.policy.validateVin(vin);
    return {
      vin,
      emirate,
      status: "CLEAR",
      simulated: true,
    };
  }
  fines(emiratesId: string) {
    return {
      emiratesIdMasked: `***${emiratesId.slice(-4)}`,
      totalFines: 0,
      simulated: true,
    };
  }
}
