import { Injectable } from "@nestjs/common";

@Injectable()
export class InsuranceIntelligenceService {
  evaluate(input: {
    qualityScore: number;
    inspectionScore: number;
    fraudRisk: "LOW" | "MEDIUM" | "HIGH";
  }) {
    const eligible =
      input.qualityScore >= 50 &&
      input.inspectionScore >= 50 &&
      input.fraudRisk !== "HIGH";

    return {
      eligible,
      riskBand:
        input.fraudRisk === "HIGH"
          ? "HIGH"
          : input.qualityScore < 70
            ? "MEDIUM"
            : "LOW",
    };
  }
}
