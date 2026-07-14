import { Injectable } from '@nestjs/common';
import {
  AccessRequest,
  SecurityPolicy,
} from './enterprise-zero-trust-security.types';

@Injectable()
export class AdaptiveAccessPolicyEngineService {
  adapt(
    request: AccessRequest,
    baseline: SecurityPolicy,
  ): SecurityPolicy {
    const sensitivityAdjustment = request.sensitivity * 0.15;
    const sessionAdjustment = request.identity.sessionRisk * 0.1;

    return {
      ...baseline,
      minimumIdentityScore: Math.min(
        100,
        Math.round(
          baseline.minimumIdentityScore + sensitivityAdjustment,
        ),
      ),
      minimumDeviceScore: Math.min(
        100,
        Math.round(
          baseline.minimumDeviceScore + sensitivityAdjustment / 2,
        ),
      ),
      maximumSessionRisk: Math.max(
        0,
        Math.round(
          baseline.maximumSessionRisk - sessionAdjustment,
        ),
      ),
    };
  }
}