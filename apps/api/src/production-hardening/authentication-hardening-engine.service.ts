import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationHardeningEngineService {
  evaluate(input: {
    mfaEnabled: boolean;
    passwordPolicyEnabled: boolean;
    sessionRotationEnabled: boolean;
    jwtExpiryMinutes: number;
    refreshTokenRotation: boolean;
  }) {
    const checks = [
      input.mfaEnabled,
      input.passwordPolicyEnabled,
      input.sessionRotationEnabled,
      input.jwtExpiryMinutes <= 30,
      input.refreshTokenRotation,
    ];

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