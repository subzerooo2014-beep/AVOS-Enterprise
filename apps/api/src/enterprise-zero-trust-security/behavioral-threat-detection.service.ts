import { Injectable } from '@nestjs/common';
import {
  BehaviorSignal,
  ThreatSeverity,
} from './enterprise-zero-trust-security.types';

@Injectable()
export class BehavioralThreatDetectionService {
  analyze(signals: BehaviorSignal[]) {
    const threats = signals
      .map((signal) => {
        const threatScore =
          signal.riskScore * 0.55 +
          signal.deviationScore * 0.35 +
          Math.min(100, signal.frequency) * 0.1;

        const severity: ThreatSeverity =
          threatScore >= 85
            ? 'critical'
            : threatScore >= 65
              ? 'high'
              : threatScore >= 40
                ? 'medium'
                : 'low';

        return {
          ...signal,
          threatScore: Math.round(threatScore),
          severity,
        };
      })
      .sort(
        (left, right) =>
          right.threatScore - left.threatScore,
      );

    return {
      threats,
      criticalActors: threats
        .filter((threat) => threat.severity === 'critical')
        .map((threat) => threat.actorId),
      highestThreat: threats[0] ?? null,
    };
  }
}