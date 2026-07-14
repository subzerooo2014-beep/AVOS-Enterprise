import { Injectable } from "@nestjs/common";
@Injectable()
export class SettlementPolicy {
  validate(winnerId?: string, paymentReference?: string) {
    if (!winnerId) throw new Error("Auction has no winner");
    if (!paymentReference) throw new Error("Payment reference required");
    return true;
  }
}
