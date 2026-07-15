import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorizationHardeningEngineService {
  evaluate(input: {
    roleBasedAccess: boolean;
    resourceOwnershipChecks: boolean;
    denyByDefault: boolean;
    privilegedAccessReview: boolean;
    auditTrailEnabled: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      hardened: score === 100,
    };
  }
}