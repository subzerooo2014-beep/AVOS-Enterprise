import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleIntelligenceSelfHealingService {
  plan(input: {
    incidentSeverity: number;
    recoveryConfidence: number;
    rollbackReadiness: number;
    automationScore: number;
  }) {
    const healingScore = Math.round(
      input.recoveryConfidence * 0.3 +
        input.rollbackReadiness * 0.25 +
        input.automationScore * 0.3 -
        input.incidentSeverity * 0.15,
    );

    return {
      healingScore,
      action:
        healingScore >= 80
          ? "AUTO_REMEDIATE"
          : healingScore >= 60
            ? "ASSISTED_REMEDIATION"
            : "MANUAL_INTERVENTION",
    };
  }
}
