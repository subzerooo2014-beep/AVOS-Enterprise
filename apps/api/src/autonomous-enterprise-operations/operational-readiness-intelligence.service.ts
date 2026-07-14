import { Injectable } from '@nestjs/common';
import { OperationalSignal } from './autonomous-enterprise-operations.types';

@Injectable()
export class OperationalReadinessIntelligenceService {
  evaluate(signals: OperationalSignal[]) {
    const domainScores = signals.map((signal) => {
      const latencyPenalty = Math.min(30, signal.latency / 10);
      const score = Math.max(
        0,
        Math.min(
          100,
          signal.health * 0.5 + signal.capacity * 0.5 - latencyPenalty,
        ),
      );

      return {
        domain: signal.domain,
        score: Math.round(score),
        ready: score >= 65,
      };
    });

    return {
      readinessScore: Math.round(
        domainScores.reduce((sum, item) => sum + item.score, 0) /
          Math.max(1, domainScores.length),
      ),
      domainScores,
      blockedDomains: domainScores
        .filter((item) => !item.ready)
        .map((item) => item.domain),
    };
  }
}