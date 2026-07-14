import { Injectable } from '@nestjs/common';
import { DeviceContext } from './enterprise-zero-trust-security.types';

@Injectable()
export class DeviceTrustIntelligenceService {
  evaluate(device: DeviceContext) {
    const score =
      device.complianceScore * 0.45 +
      (device.managed ? 20 : 0) +
      (device.encrypted ? 15 : 0) +
      (device.osPatched ? 10 : 0) -
      device.malwareScore * 0.3;

    return {
      deviceId: device.deviceId,
      trustScore: Math.round(Math.max(0, Math.min(100, score))),
      trusted: score >= 70,
      deficiencies: [
        ...(!device.managed ? ['unmanaged'] : []),
        ...(!device.encrypted ? ['unencrypted'] : []),
        ...(!device.osPatched ? ['unpatched'] : []),
        ...(device.malwareScore > 30 ? ['malware-risk'] : []),
      ],
    };
  }
}