import { Injectable } from '@nestjs/common';

@Injectable()
export class CdnReadinessEngineService {
  evaluate(input: {
    configured: boolean;
    cachePolicies: boolean;
    originProtection: boolean;
    compressionEnabled: boolean;
    imageOptimization: boolean;
    purgeSupported: boolean;
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