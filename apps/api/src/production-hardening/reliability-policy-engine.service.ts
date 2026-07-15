import { Injectable } from '@nestjs/common';
import { ReliabilityPolicy } from './production-hardening.types';

@Injectable()
export class ReliabilityPolicyEngineService {
  evaluate(policies: ReliabilityPolicy[]) {
    const evaluated = policies.map((policy) => ({
      ...policy,
      compliant:
        policy.timeoutMs > 0 &&
        policy.timeoutMs <= 30000 &&
        policy.retries >= 0 &&
        policy.retries <= 5 &&
        policy.circuitBreakerEnabled &&
        policy.gracefulShutdownEnabled,
    }));

    return {
      policies: evaluated,
      score: Math.round(
        (evaluated.filter((policy) => policy.compliant).length /
          Math.max(1, evaluated.length)) *
          100,
      ),
      nonCompliant: evaluated
        .filter((policy) => !policy.compliant)
        .map((policy) => policy.id),
    };
  }
}