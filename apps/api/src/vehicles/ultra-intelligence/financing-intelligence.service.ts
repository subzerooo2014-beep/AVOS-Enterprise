import { Injectable } from "@nestjs/common";

@Injectable()
export class FinancingIntelligenceService {
  evaluate(input: {
    vehiclePrice: number;
    qualityScore: number;
    vehicleAge: number;
    fraudRisk: "LOW" | "MEDIUM" | "HIGH";
  }) {
    const eligible =
      input.vehiclePrice > 0 &&
      input.qualityScore >= 60 &&
      input.vehicleAge <= 15 &&
      input.fraudRisk !== "HIGH";

    return {
      eligible,
      maxFinanceRatio: eligible
        ? input.qualityScore >= 80
          ? 0.8
          : 0.6
        : 0,
    };
  }
}
