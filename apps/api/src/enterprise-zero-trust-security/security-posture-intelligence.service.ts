import { Injectable } from '@nestjs/common';
import {
  DeviceContext,
  IdentityContext,
} from './enterprise-zero-trust-security.types';

@Injectable()
export class SecurityPostureIntelligenceService {
  assess(
    identities: IdentityContext[],
    devices: DeviceContext[],
  ) {
    const identityAssurance =
      identities.reduce(
        (sum, identity) =>
          sum +
          identity.authenticationStrength -
          identity.sessionRisk * 0.4 -
          identity.locationRisk * 0.2,
        0,
      ) / Math.max(1, identities.length);

    const deviceTrust =
      devices.reduce(
        (sum, device) =>
          sum +
          device.complianceScore * 0.5 +
          (device.managed ? 15 : 0) +
          (device.encrypted ? 15 : 0) +
          (device.osPatched ? 10 : 0) -
          device.malwareScore * 0.2,
        0,
      ) / Math.max(1, devices.length);

    return {
      identityAssurance: Math.round(
        Math.max(0, Math.min(100, identityAssurance)),
      ),
      deviceTrust: Math.round(
        Math.max(0, Math.min(100, deviceTrust)),
      ),
      postureScore: Math.round(
        Math.max(
          0,
          Math.min(
            100,
            identityAssurance * 0.5 + deviceTrust * 0.5,
          ),
        ),
      ),
    };
  }
}