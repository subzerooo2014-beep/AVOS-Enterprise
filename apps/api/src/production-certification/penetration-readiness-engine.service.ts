import { Injectable } from '@nestjs/common';

@Injectable()
export class PenetrationReadinessEngineService {
  evaluate(input: {
    attackSurfaceDocumented: boolean;
    authenticationTested: boolean;
    authorizationTested: boolean;
    injectionTested: boolean;
    rateLimitsTested: boolean;
    fileUploadsTested: boolean;
    findingsRemediated: boolean;
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