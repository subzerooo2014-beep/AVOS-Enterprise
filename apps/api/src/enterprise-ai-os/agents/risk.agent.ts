import { Injectable } from "@nestjs/common";
@Injectable()
export class RiskAgent {
  execute(input: { riskScore: number }) {
    return {
      riskScore: input.riskScore,
      band:
        input.riskScore >= 70
          ? "HIGH"
          : input.riskScore >= 40
            ? "MEDIUM"
            : "LOW",
    };
  }
}
