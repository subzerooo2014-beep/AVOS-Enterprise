import { Injectable } from '@nestjs/common';

@Injectable()
export class WafDdosReadinessEngineService {
  evaluate(input: {
    wafEnabled: boolean;
    managedRulesEnabled: boolean;
    botProtection: boolean;
    rateLimitingEnabled: boolean;
    ddosProtectionEnabled: boolean;
    geoRulesConfigured: boolean;
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