import { Injectable } from "@nestjs/common";
import { VehicleMarketAnalysisResult } from "./vehicle-market-analysis.types";

@Injectable()
export class VehicleMarketAnalysisService {
  analyze(vehicle: any): VehicleMarketAnalysisResult {
    const age = Math.max(0, new Date().getFullYear() - Number(vehicle?.year ?? new Date().getFullYear()));
    const mileage = Math.max(0, Number(vehicle?.mileage ?? 0));

    const agePenalty = Math.min(35, age * 3);
    const mileagePenalty = Math.min(35, Math.floor(mileage / 10_000) * 2);
    const score = Math.max(0, Math.min(100, 100 - agePenalty - mileagePenalty));

    return {
      score,
      demandLevel: score >= 75 ? "HIGH" : score >= 50 ? "MEDIUM" : "LOW",
      liquidityLevel: score >= 70 ? "HIGH" : score >= 45 ? "MEDIUM" : "LOW",
      estimatedDaysToSell: score >= 75 ? 14 : score >= 50 ? 30 : 60,
      recommendations: score < 50 ? ["review_market_positioning", "improve_listing_quality"] : [],
    };
  }
}
