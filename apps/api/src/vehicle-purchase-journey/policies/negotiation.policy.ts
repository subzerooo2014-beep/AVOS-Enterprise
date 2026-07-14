import { Injectable } from "@nestjs/common";
@Injectable()
export class NegotiationPolicy {
  validate(askingPrice: number, offerPrice: number) {
    if (offerPrice <= 0 || askingPrice <= 0) throw new Error("Invalid price");
    if (offerPrice < askingPrice * 0.5) throw new Error("Offer below allowed threshold");
    return true;
  }
}
