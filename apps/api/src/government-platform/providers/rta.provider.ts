import { Injectable } from "@nestjs/common";
import { VehicleLookupPolicy } from "../policies/vehicle-lookup.policy";
@Injectable()
export class RtaProvider {
  constructor(private readonly policy: VehicleLookupPolicy) {}
  vehicleLookup(vin: string) {
    this.policy.validateVin(vin);
    return {
      vin,
      registrationStatus: "VALID",
      registrationExpiry: "2027-12-31",
      simulated: true,
    };
  }
  fines(trafficFileNumber: string) {
    return {
      trafficFileNumber,
      totalFines: 0,
      fines: [],
      simulated: true,
    };
  }
}
