import { Injectable } from "@nestjs/common";
@Injectable()
export class BidPolicy {
  validate(input: { currentPrice: number; amount: number; minimumIncrement: number }) {
    if (input.amount < input.currentPrice + input.minimumIncrement) {
      throw new Error("Bid is below minimum increment");
    }
    return true;
  }
}
