import { Injectable } from '@nestjs/common';

@Injectable()
export class ScalabilityReadinessEngineService {
  evaluate(input: {
    statelessApi: boolean;
    sharedSessionStore: boolean;
    horizontalScalingReady: boolean;
    connectionPoolConfigured: boolean;
    queuesScalable: boolean;
    loadBalancerReady: boolean;
    idempotencySupported: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      ready: score === 100,
    };
  }
}