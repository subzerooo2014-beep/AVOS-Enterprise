import { Injectable } from "@nestjs/common";
@Injectable()
export class ReservationPolicy {
  validate(amount: number) {
    if (amount <= 0) throw new Error("Reservation amount must be positive");
    return true;
  }
}
