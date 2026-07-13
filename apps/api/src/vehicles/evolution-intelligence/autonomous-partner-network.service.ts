import { Injectable } from "@nestjs/common";

@Injectable()
export class AutonomousPartnerNetworkService {
  evaluate(input: {
    reliability: number;
    integrationScore: number;
    commercialScore: number;
    complianceScore: number;
  }) {
    const networkScore = Math.round(
      input.reliability * 0.3 +
        input.integrationScore * 0.25 +
        input.commercialScore * 0.2 +
        input.complianceScore * 0.25,
    );

    return {
      networkScore,
      status: networkScore >= 80 ? "ACTIVE" : networkScore >= 60 ? "REVIEW" : "BLOCKED",
    };
  }
}
