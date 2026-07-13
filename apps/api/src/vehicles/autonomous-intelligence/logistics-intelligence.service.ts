import { Injectable } from "@nestjs/common";

@Injectable()
export class LogisticsIntelligenceService {
  plan(input: {
    distanceScore: number;
    carrierReliability: number;
    deliveryUrgency: number;
    costEfficiency: number;
  }) {
    const logisticsScore = Math.round(
      input.distanceScore * 0.15 +
        input.carrierReliability * 0.35 +
        input.deliveryUrgency * 0.2 +
        input.costEfficiency * 0.3,
    );

    return {
      logisticsScore,
      mode: logisticsScore >= 80 ? "EXPRESS" : logisticsScore >= 55 ? "STANDARD" : "ECONOMY",
    };
  }
}
