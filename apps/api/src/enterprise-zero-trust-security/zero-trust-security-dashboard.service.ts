import { Injectable } from '@nestjs/common';
import {
  ENTERPRISE_ZERO_TRUST_SECURITY_CAPABILITIES,
  SecurityDashboardSnapshot,
} from './enterprise-zero-trust-security.types';

@Injectable()
export class ZeroTrustSecurityDashboardService {
  snapshot(input: {
    zeroTrustScore?: number;
    identityAssurance?: number;
    deviceTrust?: number;
    securityPosture?: number;
    activeIncidents?: number;
    privilegedRisk?: number;
  } = {}): SecurityDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      zeroTrustScore: Math.max(
        0,
        Math.min(100, Math.round(input.zeroTrustScore ?? 75)),
      ),
      identityAssurance: Math.max(
        0,
        Math.min(100, Math.round(input.identityAssurance ?? 75)),
      ),
      deviceTrust: Math.max(
        0,
        Math.min(100, Math.round(input.deviceTrust ?? 75)),
      ),
      securityPosture: Math.max(
        0,
        Math.min(100, Math.round(input.securityPosture ?? 75)),
      ),
      activeIncidents: Math.max(
        0,
        Math.round(input.activeIncidents ?? 0),
      ),
      privilegedRisk: Math.max(
        0,
        Math.round(input.privilegedRisk ?? 0),
      ),
      capabilityStatus: Object.fromEntries(
        ENTERPRISE_ZERO_TRUST_SECURITY_CAPABILITIES.map((capability) => [
          capability,
          'operational',
        ]),
      ) as SecurityDashboardSnapshot['capabilityStatus'],
    };
  }
}