import { Injectable } from "@nestjs/common";

@Injectable()
export class AiScenarioSimulatorService {
  simulate(input: {
    demandImpact: number;
    priceImpact: number;
    riskImpact: number;
    growthImpact: number;
  }) {
    const outcomeScore = Math.round(
      input.demandImpact * 0.3 +
        input.priceImpact * 0.25 +
        input.growthImpact * 0.3 -
        input.riskImpact * 0.15,
    );

    return {
      outcomeScore,
      recommendation: outcomeScore >= 75 ? "EXECUTE" : outcomeScore >= 50 ? "TEST" : "AVOID",
    };
  }
}
