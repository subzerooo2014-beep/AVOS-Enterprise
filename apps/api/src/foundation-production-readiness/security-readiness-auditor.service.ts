import { Injectable } from '@nestjs/common';
import { ReadinessCheck } from './foundation-production-readiness.types';

@Injectable()
export class SecurityReadinessAuditorService {
  audit(input: {
    zeroTrustEnabled: boolean;
    secretsGoverned: boolean;
    threatDetectionEnabled: boolean;
    incidentResponseReady: boolean;
  }): ReadinessCheck {
    const controls = [
      input.zeroTrustEnabled,
      input.secretsGoverned,
      input.threatDetectionEnabled,
      input.incidentResponseReady,
    ];
    const score = Math.round(
      (controls.filter(Boolean).length / controls.length) * 100,
    );

    return {
      id: 'security-readiness',
      category: 'security',
      name: 'Enterprise security readiness',
      passed: score === 100,
      score,
      evidence: [
        'zero-trust',
        'secrets-governance',
        'threat-detection',
        'incident-response',
      ],
      blockers:
        score === 100 ? [] : ['security-controls-incomplete'],
    };
  }
}