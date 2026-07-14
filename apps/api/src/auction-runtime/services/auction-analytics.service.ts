import { Injectable } from "@nestjs/common";
@Injectable()
export class AuctionAnalyticsService {
  calculate(input: { startingPrice: number; finalPrice: number; bidCount: number }) {
    return {
      upliftPercent: input.startingPrice
        ? Math.round(((input.finalPrice - input.startingPrice) / input.startingPrice) * 100)
        : 0,
      bidCount: input.bidCount,
    };
  }
}
