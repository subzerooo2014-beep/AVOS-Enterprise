import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleRiskAggregationService {
  aggregate(input: {
    fraudRisk: number;
    complianceRisk: number;
    operationalRisk: number;
    marketRisk: number;
  }) {
    const riskScore = Math.round(
      input.fraudRisk * 0.35 +
      input.complianceRisk * 0.25 +
      input.operationalRisk * 0.2 +
      input.marketRisk * 0.2,
    );

    return {
      riskScore,
      level:
        riskScore >= 80
          ? "CRITICAL"
          : riskScore >= 55
            ? "HIGH"
            : riskScore >= 30
              ? "MEDIUM"
              : "LOW",
    };
  }
}
