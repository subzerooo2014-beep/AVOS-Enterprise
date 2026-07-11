import { Injectable } from "@nestjs/common";
import { ReservationAlreadyClosedException } from "./cancel-reservation.errors";

@Injectable()
export class CancelReservationPolicy {

  ensureCanCancel(status:string){

    if(
      status==="CANCELLED" ||
      status==="COMPLETED" ||
      status==="EXPIRED"
    ){
      throw new ReservationAlreadyClosedException();
    }

  }

}
