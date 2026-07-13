import { Injectable } from "@nestjs/common";

@Injectable()
export class ExportRouteIntelligenceService {
  evaluate(input: {
    destinationDemand: number;
    shippingEfficiency: number;
    customsComplexity: number;
    marginScore: number;
  }) {
    const routeScore = Math.round(
      input.destinationDemand * 0.35 +
        input.shippingEfficiency * 0.25 +
        input.marginScore * 0.3 -
        input.customsComplexity * 0.1,
    );

    return {
      routeScore,
      recommended: routeScore >= 65,
    };
  }
}
