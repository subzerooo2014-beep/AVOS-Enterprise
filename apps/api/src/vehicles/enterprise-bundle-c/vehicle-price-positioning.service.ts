import { Injectable } from "@nestjs/common";

@Injectable()
export class VehiclePricePositioningService {
  evaluate(input: {
    askingPrice: number;
    marketMedian: number;
    conditionScore: number;
  }) {
    const ratio =
      input.marketMedian > 0
        ? input.askingPrice / input.marketMedian
        : 1;

    const adjustedRatio =
      ratio - (input.conditionScore - 50) / 1000;

    return {
      ratio: Number(adjustedRatio.toFixed(4)),
      position:
        adjustedRatio <= 0.95
          ? "UNDER_MARKET"
          : adjustedRatio <= 1.05
            ? "AT_MARKET"
            : "ABOVE_MARKET",
    };
  }
}
