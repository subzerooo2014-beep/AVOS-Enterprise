import { Injectable } from "@nestjs/common";
import { clamp, round } from "../ultra-ai-commerce.utils";

@Injectable()
export class ExportIntelligenceEngine {
  evaluate(input: { vehicleValue: number; shippingCost: number; customsEstimate: number; demandScore: number }) {
    const landedCost = input.vehicleValue + input.shippingCost + input.customsEstimate;
    const score = clamp(input.demandScore - (input.shippingCost + input.customsEstimate) / Math.max(1, input.vehicleValue) * 100);
    return { landedCost: round(landedCost), exportScore: score, recommendation: score >= 65 ? "EXPORT" : score >= 45 ? "REVIEW" : "LOCAL_ONLY" };
  }
}
