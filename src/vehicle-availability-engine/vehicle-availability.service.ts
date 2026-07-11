import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleAvailabilityService {

  isAvailable(status:string){

    return status === "AVAILABLE";

  }

  canReserve(status:string){

    return status === "AVAILABLE";

  }

  canSell(status:string){

    return status === "AVAILABLE" || status === "RESERVED";

  }

}
