import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisReadinessEngineService {
  evaluate(input: {
    configured: boolean;
    tlsEnabled: boolean;
    authenticationEnabled: boolean;
    persistenceEnabled: boolean;
    replicationEnabled: boolean;
    evictionPolicyConfigured: boolean;
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