import { Injectable } from "@nestjs/common";
import { RuntimeSignalDto } from "./dto/aeos-production.dto";

@Injectable()
export class HealthScoringService {
  calculate(signal: RuntimeSignalDto) {
    let score = 100;
    const reasons: string[] = [];

    if (signal.healthy === false) {
      score -= 40;
      reasons.push("Health probe failed.");
    }

    if ((signal.errorRate ?? 0) > 0.01) {
      score -= Math.min(25, Math.round((signal.errorRate ?? 0) * 100));
      reasons.push("Elevated error rate.");
    }

    const target = signal.slaTargetMs ?? 2000;
    if ((signal.latencyMs ?? 0) > target) {
      score -= 15;
      reasons.push("Latency exceeds SLA target.");
    }

    if ((signal.capacityUsed ?? 0) > 0.85) {
      score -= 15;
      reasons.push("Capacity utilization is high.");
    }

    score = Math.max(0, Math.min(100, score));

    return {
      unit: signal.unit,
      score,
      level: score >= 90 ? "excellent" : score >= 75 ? "healthy" : score >= 50 ? "degraded" : "critical",
      reasons: reasons.length ? reasons : ["All production health indicators are within thresholds."],
      calculatedAt: new Date().toISOString(),
    };
  }
}