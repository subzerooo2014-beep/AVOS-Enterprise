import { Injectable } from '@nestjs/common';
import { StrategicRisk } from './enterprise-strategic-governance.types';

@Injectable()
export class StrategicRiskIntelligenceService {
  assess(risks: StrategicRisk[]) {
    const ranked = risks
      .map((risk) => ({
        ...risk,
        exposure: Math.round(risk.probability * risk.impact),
      }))
      .sort((left, right) => right.exposure - left.exposure);

    return {
      ranked,
      totalExposure: ranked.reduce(
        (sum, risk) => sum + risk.exposure,
        0,
      ),
      criticalRisks: ranked
        .filter((risk) => risk.exposure >= 50)
        .map((risk) => risk.id),
    };
  }
}