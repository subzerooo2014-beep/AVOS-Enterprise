import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleConversionForecastService {
  forecast(input: {
    demandScore: number;
    listingQuality: number;
    priceScore: number;
    sellerScore: number;
  }) {
    const conversionScore = Math.round(
      input.demandScore * 0.3 +
      input.listingQuality * 0.25 +
      input.priceScore * 0.25 +
      input.sellerScore * 0.2,
    );

    return {
      conversionScore,
      forecast:
        conversionScore >= 80
          ? "FAST"
          : conversionScore >= 60
            ? "NORMAL"
            : "SLOW",
    };
  }
}
