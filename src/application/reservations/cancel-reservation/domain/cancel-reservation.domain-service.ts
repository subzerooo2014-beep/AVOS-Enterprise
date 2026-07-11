import { Injectable } from "@nestjs/common";
import { ReservationNotFoundException } from "./cancel-reservation.errors";

@Injectable()
export class CancelReservationDomainService {

  ensureReservationExists(
    reservation:any
  ){

    if(!reservation){
      throw new ReservationNotFoundException();
    }

  }

}
