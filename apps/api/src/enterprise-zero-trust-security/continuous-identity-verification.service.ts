import { Injectable } from '@nestjs/common';
import { IdentityContext } from './enterprise-zero-trust-security.types';

@Injectable()
export class ContinuousIdentityVerificationService {
  verify(identity: IdentityContext) {
    const freshnessMinutes =
      (Date.now() - new Date(identity.verifiedAt).getTime()) / 60_000;
    const score = Math.max(
      0,
      Math.min(
        100,
        identity.authenticationStrength -
          identity.sessionRisk * 0.4 -
          identity.locationRisk * 0.3 -
          Math.min(30, freshnessMinutes / 10),
      ),
    );

    return {
      userId: identity.userId,
      assuranceScore: Math.round(score),
      verified: score >= 70,
      reauthenticationRequired:
        score < 70 || freshnessMinutes > 240,
    };
  }
}