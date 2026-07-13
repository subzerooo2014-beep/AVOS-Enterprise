import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleDemandForecastService {
  forecast(input: {
    historicalDemand: number;
    seasonality: number;
    marketMomentum: number;
    inventoryPressure: number;
  }) {
    const score = Math.round(
      input.historicalDemand * 0.35 +
        input.seasonality * 0.2 +
        input.marketMomentum * 0.3 +
        input.inventoryPressure * 0.15,
    );

    return {
      demandScore: score,
      direction: score >= 75 ? "RISING" : score >= 50 ? "STABLE" : "FALLING",
    };
  }
}
