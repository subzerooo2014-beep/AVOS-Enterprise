import { Injectable } from "@nestjs/common";
@Injectable()
export class OfferPolicy {
  validate(askingPrice: number, offerPrice: number) {
    if (offerPrice < askingPrice * 0.5) throw new Error("Offer below allowed threshold");
    return true;
  }
}
