import { Injectable } from "@nestjs/common";
import { OfferPolicy } from "../policies/offer.policy";
@Injectable()
export class SellerOfferService {
  private readonly offers: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: OfferPolicy) {}
  create(input: {
    journeyId: string;
    buyerId: string;
    askingPrice: number;
    amount: number;
    message?: string;
  }) {
    this.policy.validate(input.askingPrice, input.amount);
    const offer = {
      id: `offer_${Date.now()}`,
      ...input,
      status: "PENDING",
    };
    this.offers.push(offer);
    return offer;
  }
  list() { return [...this.offers]; }
}
