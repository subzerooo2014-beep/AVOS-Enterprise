import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleInsuranceReadinessService {
  evaluate(input: {
    inspectionScore: number;
    fraudScore: number;
    documentScore: number;
    riskScore: number;
  }) {
    const score = Math.max(
      0,
      Math.round(
        input.inspectionScore * 0.35 +
        input.documentScore * 0.3 +
        input.fraudScore * 0.2 -
        input.riskScore * 0.15,
      ),
    );

    return {
      score,
      insurable: score >= 70,
    };
  }
}
