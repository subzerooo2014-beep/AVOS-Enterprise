import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleMarketPulseService {
  evaluate(input: {
    searchTrend: number;
    transactionTrend: number;
    priceTrend: number;
    inventoryTrend: number;
  }) {
    const pulseScore = Math.round(
      input.searchTrend * 0.3 +
      input.transactionTrend * 0.3 +
      input.priceTrend * 0.2 +
      input.inventoryTrend * 0.2,
    );

    return {
      pulseScore,
      signal:
        pulseScore >= 75
          ? "EXPANSION"
          : pulseScore >= 50
            ? "STABLE"
            : "CONTRACTION",
    };
  }
}
