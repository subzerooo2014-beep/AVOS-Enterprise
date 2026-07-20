import { Injectable } from "@nestjs/common";

@Injectable()
export class DynamicPriorityManagementService {
  calculate(input: {
    businessImpact?: number;
    urgency?: number;
    risk?: number;
    complianceCritical?: boolean;
  }) {
    const impact = Math.max(0, Math.min(100, input.businessImpact ?? 50));
    const urgency = Math.max(0, Math.min(100, input.urgency ?? 50));
    const risk = Math.max(0, Math.min(100, input.risk ?? 50));
    const complianceBoost = input.complianceCritical ? 20 : 0;
    const score = Math.min(
      100,
      Math.round(impact * 0.4 + urgency * 0.35 + risk * 0.25 + complianceBoost),
    );

    return {
      score,
      level: score >= 85 ? "critical" : score >= 65 ? "high" : score >= 40 ? "normal" : "low",
      calculatedAt: new Date().toISOString(),
    };
  }
}