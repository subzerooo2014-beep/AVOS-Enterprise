import { Injectable } from "@nestjs/common";
@Injectable()
export class SellerNegotiationService {
  advise(input: {
    askingPrice: number;
    offerPrice: number;
    marketAveragePrice: number;
  }) {
    const gap =
      ((input.askingPrice - input.offerPrice) / input.askingPrice) * 100;
    return {
      gapPercent: Math.round(gap),
      action:
        input.offerPrice >= input.marketAveragePrice * 0.95
          ? "ACCEPT"
          : gap <= 10
            ? "COUNTER"
            : "REJECT",
      counterAmount: Math.round(
        (input.askingPrice + input.offerPrice) / 2,
      ),
    };
  }
}
