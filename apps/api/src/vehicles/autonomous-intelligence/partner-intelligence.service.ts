import { Injectable } from "@nestjs/common";

@Injectable()
export class PartnerIntelligenceService {
  evaluate(input: {
    reliability: number;
    compliance: number;
    profitability: number;
    integrationReadiness: number;
  }) {
    const partnerScore = Math.round(
      input.reliability * 0.3 +
        input.compliance * 0.25 +
        input.profitability * 0.25 +
        input.integrationReadiness * 0.2,
    );

    return {
      partnerScore,
      approved: partnerScore >= 70,
    };
  }
}
