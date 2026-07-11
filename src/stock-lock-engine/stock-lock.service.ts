import { Injectable } from "@nestjs/common";

@Injectable()
export class StockLockService {

  lock(vehicleId:string){

    return {
      vehicleId,
      status:"LOCKED",
      lockedAt:new Date(),
    };

  }

  release(vehicleId:string){

    return {
      vehicleId,
      status:"RELEASED",
      releasedAt:new Date(),
    };

  }

}
