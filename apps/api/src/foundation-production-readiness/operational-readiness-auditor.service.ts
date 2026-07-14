import { Injectable } from '@nestjs/common';
import { ReadinessCheck } from './foundation-production-readiness.types';

@Injectable()
export class OperationalReadinessAuditorService {
  audit(input: {
    observabilityReady: boolean;
    resilienceReady: boolean;
    continuityReady: boolean;
    orchestrationReady: boolean;
  }): ReadinessCheck {
    const controls = [
      input.observabilityReady,
      input.resilienceReady,
      input.continuityReady,
      input.orchestrationReady,
    ];
    const score = Math.round(
      (controls.filter(Boolean).length / controls.length) * 100,
    );

    return {
      id: 'operations-readiness',
      category: 'operations',
      name: 'Enterprise operational readiness',
      passed: score === 100,
      score,
      evidence: [
        'observability',
        'resilience',
        'continuity',
        'orchestration',
      ],
      blockers:
        score === 100 ? [] : ['operations-controls-incomplete'],
    };
  }
}