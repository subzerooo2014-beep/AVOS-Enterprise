import { Injectable } from "@nestjs/common";

@Injectable()
export class DynamicRegulationEngineService {
  evaluate(input: {
    complianceScore: number;
    jurisdictionScore: number;
    documentScore: number;
    sanctionsRisk: number;
  }) {
    const regulationScore = Math.max(
      0,
      Math.round(
        input.complianceScore * 0.35 +
          input.jurisdictionScore * 0.25 +
          input.documentScore * 0.3 -
          input.sanctionsRisk * 0.1,
      ),
    );

    return {
      regulationScore,
      allowed: regulationScore >= 70,
    };
  }
}
