import { Injectable } from "@nestjs/common";
@Injectable()
export class PaymentPolicy {
  validate(amount: number) {
    if (amount <= 0) throw new Error("Payment amount must be positive");
    return true;
  }
}
