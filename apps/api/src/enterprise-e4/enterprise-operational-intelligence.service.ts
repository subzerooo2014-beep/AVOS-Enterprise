import { Injectable } from "@nestjs/common";
import { EnterpriseReliabilityIntelligenceService } from "./enterprise-reliability-intelligence.service";

@Injectable()
export class EnterpriseOperationalIntelligenceService {
  constructor(
    private readonly reliability: EnterpriseReliabilityIntelligenceService,
  ) {}

  analyze() {
    const snapshot = this.reliability.snapshot();
    const recommendations: string[] = [];

    if (snapshot.criticalIncidents > 0) {
      recommendations.push("Activate critical recovery command.");
      recommendations.push("Freeze non-essential enterprise operations.");
    } else if (snapshot.activeIncidents > 0) {
      recommendations.push("Continue controlled mitigation.");
      recommendations.push("Increase telemetry sampling.");
    } else {
      recommendations.push("Maintain normal enterprise operations.");
      recommendations.push("Preserve current recovery readiness.");
    }

    return {
      system: "AVOS Enterprise Operational Intelligence",
      reliability: snapshot,
      recommendations,
      decision:
        snapshot.criticalIncidents > 0
          ? "RECOVERY_REQUIRED"
          : snapshot.activeIncidents > 0
            ? "CONTROLLED_DEGRADATION"
            : "NORMAL_OPERATION",
      generatedAt: new Date().toISOString(),
    };
  }
}