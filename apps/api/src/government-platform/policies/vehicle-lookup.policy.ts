import { Injectable } from "@nestjs/common";
@Injectable()
export class VehicleLookupPolicy {
  validateVin(vin: string) {
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
      throw new Error("Invalid VIN");
    }
    return true;
  }
}
