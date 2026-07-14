import { Injectable } from "@nestjs/common";

@Injectable()
export class AiScenarioSimulatorService {
  simulate(name = "enterprise-growth", probability = 78, impact = 86) {
    const score = Math.round(probability * 0.45 + impact * 0.55);

    return {
      name,
      probability,
      impact,
      score,
      recommendation:
        score >= 80
          ? "execute-priority-plan"
          : score >= 60
            ? "execute-controlled-pilot"
            : "monitor-and-reassess",
      simulatedAt: new Date().toISOString(),
    };
  }
}