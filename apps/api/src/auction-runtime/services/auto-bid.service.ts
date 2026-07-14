import { Injectable } from "@nestjs/common";
import { AutoBidPolicy } from "../policies/auto-bid.policy";
@Injectable()
export class AutoBidService {
  private readonly rules: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: AutoBidPolicy) {}
  configure(input: {
    auctionId: string;
    bidderId: string;
    maximumAmount: number;
    currentPrice: number;
    increment?: number;
  }) {
    this.policy.validate(input.maximumAmount, input.currentPrice);
    const rule = {
      id: `auto_${Date.now()}`,
      ...input,
      increment: input.increment ?? 500,
      active: true,
    };
    this.rules.push(rule);
    return rule;
  }
  list() { return [...this.rules]; }
}
