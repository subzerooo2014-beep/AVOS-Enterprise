import { Injectable } from '@nestjs/common';
import { ReadinessCheck } from './foundation-production-readiness.types';

@Injectable()
export class DataReadinessAuditorService {
  audit(input: {
    governanceEnabled: boolean;
    lineageEnabled: boolean;
    qualityEnabled: boolean;
    sovereigntyEnabled: boolean;
  }): ReadinessCheck {
    const controls = [
      input.governanceEnabled,
      input.lineageEnabled,
      input.qualityEnabled,
      input.sovereigntyEnabled,
    ];
    const score = Math.round(
      (controls.filter(Boolean).length / controls.length) * 100,
    );

    return {
      id: 'data-readiness',
      category: 'data',
      name: 'Enterprise data readiness',
      passed: score === 100,
      score,
      evidence: [
        'data-governance',
        'data-lineage',
        'data-quality',
        'data-sovereignty',
      ],
      blockers:
        score === 100 ? [] : ['data-controls-incomplete'],
    };
  }
}