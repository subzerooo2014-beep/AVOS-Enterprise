import { Injectable } from '@nestjs/common';

@Injectable()
export class ObjectStorageReadinessEngineService {
  evaluate(input: {
    configured: boolean;
    encryptionEnabled: boolean;
    lifecycleRules: boolean;
    versioningEnabled: boolean;
    privateByDefault: boolean;
    signedUrlsEnabled: boolean;
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