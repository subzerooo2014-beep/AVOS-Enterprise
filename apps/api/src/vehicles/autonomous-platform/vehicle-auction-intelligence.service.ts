import { Injectable } from "@nestjs/common";
import {
  VehicleAuctionIntelligenceInput,
  VehicleAuctionIntelligenceResult,
} from "./vehicle-auction-intelligence.types";

@Injectable()
export class VehicleAuctionIntelligenceService {
  evaluate(input: VehicleAuctionIntelligenceInput): VehicleAuctionIntelligenceResult {
    const auctionScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          input.primaryScore * 0.5 +
            input.secondaryScore * 0.35 -
            input.riskScore * 0.15,
        ),
      ),
    );

    const status =
      auctionScore >= 80
        ? "STRONG"
        : auctionScore >= 55
          ? "WATCH"
          : "WEAK";

    return {
      vehicleId: input.vehicleId,
      auctionScore,
      status,
      recommendations:
        status === "STRONG"
          ? ["scale-capability"]
          : status === "WATCH"
            ? ["optimize-capability"]
            : ["manual-intervention"],
    };
  }
}
