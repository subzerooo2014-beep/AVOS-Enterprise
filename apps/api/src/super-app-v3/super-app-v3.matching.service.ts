import { Injectable } from "@nestjs/common";
import {
  BuyerProfile,
  MatchResult,
  VehicleOffer,
} from "./super-app-v3.types";

@Injectable()
export class SuperAppV3MatchingService {
  match(buyer: BuyerProfile, vehicles: VehicleOffer[]): MatchResult[] {
    return vehicles
      .filter((vehicle) => vehicle.available)
      .map((vehicle) => {
        let score = 0;
        const reasons: string[] = [];

        if (vehicle.price <= buyer.budget) {
          score += 35;
          reasons.push("within_budget");
        }

        if (buyer.preferredBrands.includes(vehicle.brand)) {
          score += 25;
          reasons.push("preferred_brand");
        }

        if (buyer.preferredBodyTypes.includes(vehicle.bodyType)) {
          score += 20;
          reasons.push("preferred_body_type");
        }

        if (vehicle.location === buyer.location) {
          score += 10;
          reasons.push("same_location");
        }

        score += Math.min(10, Math.round(vehicle.trustScore / 10));

        return {
          vehicleId: vehicle.id,
          score: Math.min(100, score),
          reasons,
        };
      })
      .sort((a, b) => b.score - a.score);
  }
}
