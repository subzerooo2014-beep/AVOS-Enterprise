import { Injectable } from "@nestjs/common";
import { VehiclePricingResult } from "./vehicle-pricing.types";

@Injectable()
export class VehiclePricingAiService {
  estimatePrice(basePrice: number): VehiclePricingResult {
    const estimatedPrice = Math.round(basePrice);
    const minimumPrice = Math.round(estimatedPrice * 0.9);
    const maximumPrice = Math.round(estimatedPrice * 1.1);

    return {
      estimatedPrice,
      minimumPrice,
      maximumPrice,
      currency: "AED",
      confidence: 0.8,
      factors: ["base_price"],
    };
  }
}
