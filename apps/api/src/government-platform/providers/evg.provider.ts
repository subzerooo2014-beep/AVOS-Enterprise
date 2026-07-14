import { Injectable } from "@nestjs/common";
import { VehicleLookupPolicy } from "../policies/vehicle-lookup.policy";
@Injectable()
export class EvgProvider {
  constructor(private readonly policy: VehicleLookupPolicy) {}
  history(vin: string) {
    this.policy.validateVin(vin);
    return {
      vin,
      owners: 1,
      accidents: 0,
      serviceRecords: 4,
      simulated: true,
    };
  }
  accidents(vin: string) {
    this.policy.validateVin(vin);
    return {
      vin,
      accidentCount: 0,
      accidents: [],
      simulated: true,
    };
  }
}
