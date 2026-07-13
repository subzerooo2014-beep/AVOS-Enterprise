import { Injectable } from "@nestjs/common";
import {
  BuyerMatchingInput,
  BuyerMatchingResult,
  BuyerMatchingVehicle,
} from "./buyer-matching.types";

@Injectable()
export class BuyerMatchingAiService {
  match(
    buyer: BuyerMatchingInput,
    vehicle: BuyerMatchingVehicle,
  ): BuyerMatchingResult {
    let score = 0;
    const reasons: string[] = [];

    if (
      vehicle.price >= buyer.budgetMin &&
      vehicle.price <= buyer.budgetMax
    ) {
      score += 35;
      reasons.push("budget-match");
    }

    if (buyer.preferredBrands.includes(vehicle.brand)) {
      score += 20;
      reasons.push("brand-match");
    }

    if (buyer.preferredBodyTypes.includes(vehicle.bodyType)) {
      score += 15;
      reasons.push("body-type-match");
    }

    if (buyer.preferredFuelTypes.includes(vehicle.fuelType)) {
      score += 10;
      reasons.push("fuel-type-match");
    }

    score += Math.round(vehicle.qualityScore * 0.1);
    score += Math.round(vehicle.trustScore * 0.1);

    return {
      buyerId: buyer.buyerId,
      vehicleId: vehicle.vehicleId,
      matchScore: Math.min(100, score),
      reasons,
    };
  }
}
