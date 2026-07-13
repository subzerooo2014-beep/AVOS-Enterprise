import { Injectable } from "@nestjs/common";

@Injectable()
export class IntelligentServiceOrchestratorService {
  orchestrate(input: {
    serviceFit: number;
    providerQuality: number;
    urgency: number;
    costEfficiency: number;
  }) {
    const serviceScore = Math.round(
      input.serviceFit * 0.3 +
        input.providerQuality * 0.3 +
        input.urgency * 0.2 +
        input.costEfficiency * 0.2,
    );

    return {
      serviceScore,
      route: serviceScore >= 80 ? "PRIORITY" : serviceScore >= 60 ? "STANDARD" : "REVIEW",
    };
  }
}
