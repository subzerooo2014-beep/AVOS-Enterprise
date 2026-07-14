import { Injectable } from '@nestjs/common';
import {
  OperationalRisk,
  RiskSeverity,
} from './enterprise-resilience-continuity.types';

@Injectable()
export class OperationalRiskIntelligenceService {
  assess(risks: OperationalRisk[]) {
    const ranked = risks
      .map((risk) => {
        const exposure =
          risk.probability *
          risk.impact *
          (1 + (100 - risk.detectability) / 100);

        const severity: RiskSeverity =
          exposure >= 80
            ? 'critical'
            : exposure >= 50
              ? 'high'
              : exposure >= 25
                ? 'medium'
                : 'low';

        return {
          ...risk,
          exposure: Math.round(exposure),
          severity,
        };
      })
      .sort((left, right) => right.exposure - left.exposure);

    return {
      ranked,
      totalExposure: ranked.reduce(
        (sum, risk) => sum + risk.exposure,
        0,
      ),
      criticalRiskIds: ranked
        .filter((risk) => risk.severity === 'critical')
        .map((risk) => risk.id),
    };
  }
}