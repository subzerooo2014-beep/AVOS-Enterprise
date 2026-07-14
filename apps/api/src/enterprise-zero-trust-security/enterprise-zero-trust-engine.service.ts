import { Injectable } from '@nestjs/common';
import {
  AccessRequest,
  SecurityDecision,
  SecurityPolicy,
} from './enterprise-zero-trust-security.types';

@Injectable()
export class EnterpriseZeroTrustEngineService {
  evaluate(
    request: AccessRequest,
    policies: SecurityPolicy[],
  ): {
    decision: SecurityDecision;
    score: number;
    reasons: string[];
  } {
    const identityScore =
      request.identity.authenticationStrength -
      request.identity.sessionRisk * 0.35 -
      request.identity.locationRisk * 0.25;

    const deviceScore =
      request.device.complianceScore * 0.45 +
      (request.device.managed ? 20 : 0) +
      (request.device.encrypted ? 15 : 0) +
      (request.device.osPatched ? 10 : 0) -
      request.device.malwareScore * 0.3;

    const policy = policies[0];
    const reasons: string[] = [];

    if (policy) {
      if (identityScore < policy.minimumIdentityScore) {
        reasons.push('identity-assurance-below-policy');
      }
      if (deviceScore < policy.minimumDeviceScore) {
        reasons.push('device-trust-below-policy');
      }
      if (request.identity.sessionRisk > policy.maximumSessionRisk) {
        reasons.push('session-risk-above-policy');
      }
      if (
        policy.privilegedActions.includes(request.action) &&
        !request.identity.roles.includes('privileged-admin')
      ) {
        reasons.push('privileged-role-required');
      }
    }

    const score = Math.max(
      0,
      Math.min(
        100,
        identityScore * 0.45 +
          deviceScore * 0.4 +
          (100 - request.sensitivity) * 0.15,
      ),
    );

    const decision: SecurityDecision =
      reasons.length >= 2 || score < 50
        ? 'deny'
        : reasons.length === 1 || score < 75
          ? 'challenge'
          : 'allow';

    return {
      decision,
      score: Math.round(score),
      reasons,
    };
  }
}