import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleComplianceIntelligenceService {
  evaluate(input: {
    documentScore: number;
    inspectionScore: number;
    regulationScore: number;
    sanctionsRisk: number;
  }) {
    const complianceScore = Math.max(
      0,
      Math.round(
        input.documentScore * 0.3 +
          input.inspectionScore * 0.3 +
          input.regulationScore * 0.3 -
          input.sanctionsRisk * 0.1,
      ),
    );

    return {
      complianceScore,
      compliant: complianceScore >= 75,
    };
  }
}
