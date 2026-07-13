import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleExportReadinessService {
  evaluate(input: {
    complianceScore: number;
    destinationDemand: number;
    logisticsScore: number;
    marginScore: number;
  }) {
    const score = Math.round(
      input.complianceScore * 0.3 +
      input.destinationDemand * 0.3 +
      input.logisticsScore * 0.2 +
      input.marginScore * 0.2,
    );

    return {
      score,
      exportReady: score >= 70,
    };
  }
}
