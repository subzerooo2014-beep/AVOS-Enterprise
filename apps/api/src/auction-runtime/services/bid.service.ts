import { Injectable } from "@nestjs/common";
import { BidPolicy } from "../policies/bid.policy";
@Injectable()
export class BidService {
  private readonly bids: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: BidPolicy) {}
  place(input: {
    auctionId: string;
    bidderId: string;
    amount: number;
    currentPrice: number;
    minimumIncrement: number;
  }) {
    this.policy.validate(input);
    const bid = {
      id: `bid_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      auctionId: input.auctionId,
      bidderId: input.bidderId,
      amount: input.amount,
      createdAt: new Date().toISOString(),
    };
    this.bids.push(bid);
    return bid;
  }
  list() { return [...this.bids]; }
}
