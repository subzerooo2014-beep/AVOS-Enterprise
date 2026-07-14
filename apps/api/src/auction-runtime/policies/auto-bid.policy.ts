import { Injectable } from "@nestjs/common";
@Injectable()
export class AutoBidPolicy {
  validate(maximumAmount: number, currentPrice: number) {
    if (maximumAmount <= currentPrice) throw new Error("Auto bid maximum must exceed current price");
    if (maximumAmount > 10000000) throw new Error("Auto bid limit exceeded");
    return true;
  }
}
