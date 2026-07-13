import { Injectable } from "@nestjs/common";

@Injectable()
export class ExportIntelligenceService {
  evaluate(input: {
    vehicleAge: number;
    conditionScore: number;
    destinationDemand: number;
    shippingCostScore: number;
  }) {
    const exportScore = Math.round(
      Math.max(0, 100 - input.vehicleAge * 2) * 0.2 +
        input.conditionScore * 0.35 +
        input.destinationDemand * 0.3 +
        input.shippingCostScore * 0.15,
    );

    return {
      exportScore,
      viable: exportScore >= 65,
    };
  }
}
