import { Injectable } from "@nestjs/common";

@Injectable()
export class ReservationEngineService {

  createReservation(
    vehicleId:string,
    customerId:string
  ){

    const expires = new Date();
    expires.setHours(expires.getHours()+24);

    return {
      reservationId: crypto.randomUUID(),
      vehicleId,
      customerId,
      status:"ACTIVE",
      expiresAt:expires,
    };

  }

  isExpired(expireDate:Date){
    return expireDate.getTime() < Date.now();
  }

}
