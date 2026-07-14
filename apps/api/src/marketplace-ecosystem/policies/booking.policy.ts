import { Injectable } from "@nestjs/common";
@Injectable()
export class BookingPolicy {
  validate(scheduledAt: string, amount: number) {
    if (new Date(scheduledAt) <= new Date()) throw new Error("Booking must be in the future");
    if (amount <= 0) throw new Error("Invalid booking amount");
    return true;
  }
}
