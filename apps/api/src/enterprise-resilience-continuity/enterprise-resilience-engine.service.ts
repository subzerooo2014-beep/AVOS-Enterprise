import { Injectable } from '@nestjs/common';
import { ResilienceSignal } from './enterprise-resilience-continuity.types';

@Injectable()
export class EnterpriseResilienceEngineService {
  evaluate(signals: ResilienceSignal[]) {
    const domains = signals.map((signal) => {
      const score =
        signal.health * 0.45 +
        signal.redundancy * 0.25 +
        signal.recoveryReadiness * 0.3;

      return {
        domain: signal.domain,
        score: Math.round(Math.max(0, Math.min(100, score))),
        resilient: score >= 70,
      };
    });

    return {
      domains,
      resilienceScore: Math.round(
        domains.reduce((sum, domain) => sum + domain.score, 0) /
          Math.max(1, domains.length),
      ),
      weakDomains: domains
        .filter((domain) => !domain.resilient)
        .map((domain) => domain.domain),
    };
  }
}