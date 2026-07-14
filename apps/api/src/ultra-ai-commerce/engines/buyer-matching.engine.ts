import { Injectable } from "@nestjs/common";
import { BuyerMatchingInput } from "../ultra-ai-commerce.types";
import { clamp } from "../ultra-ai-commerce.utils";

@Injectable()
export class BuyerMatchingEngine {
  match(input: BuyerMatchingInput) {
    return input.vehicles
      .map((vehicle) => {
        let score = 0;
        const reasons: string[] = [];
        if (vehicle.price <= input.budget) { score += 30; reasons.push("budget_fit"); }
        if (input.preferredBrands.includes(vehicle.brand)) { score += 25; reasons.push("brand_fit"); }
        if (input.preferredBodyTypes.includes(vehicle.bodyType)) { score += 15; reasons.push("body_fit"); }
        if (vehicle.location === input.location) { score += 10; reasons.push("location_fit"); }
        score += vehicle.trustScore * 0.1;
        score += vehicle.conditionScore * 0.1;
        return { vehicleId: vehicle.id, score: clamp(score), reasons };
      })
      .sort((a, b) => b.score - a.score);
  }
}
