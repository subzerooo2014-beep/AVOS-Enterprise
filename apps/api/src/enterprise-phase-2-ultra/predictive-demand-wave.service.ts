import { Injectable } from "@nestjs/common";

@Injectable()
export class PredictiveDemandWaveService {
  predict(currentDemand = 120, previousDemand = 100) {
    const delta = currentDemand - previousDemand;
    const trend = delta > 5 ? "RISING" : delta < -5 ? "FALLING" : "STABLE";
    const multiplier = trend === "RISING" ? 1.18 : trend === "FALLING" ? 0.9 : 1.04;

    return {
      currentDemand,
      previousDemand,
      predictedDemand: Math.round(currentDemand * multiplier),
      trend,
      confidence: Math.min(99, 80 + Math.abs(delta)),
      generatedAt: new Date().toISOString(),
    };
  }
}