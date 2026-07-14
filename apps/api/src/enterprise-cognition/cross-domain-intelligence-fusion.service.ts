import { Injectable } from '@nestjs/common';
import { CognitionSignal } from './enterprise-cognition.types';

@Injectable()
export class CrossDomainIntelligenceFusionService {
  fuse(signals: CognitionSignal[]) {
    const domains = [...new Set(signals.map((signal) => signal.domain))];
    const relationships: Array<{
      from: string;
      to: string;
      correlationStrength: number;
    }> = [];

    for (let left = 0; left < domains.length; left += 1) {
      for (let right = left + 1; right < domains.length; right += 1) {
        const leftSignals = signals.filter(
          (signal) => signal.domain === domains[left],
        );
        const rightSignals = signals.filter(
          (signal) => signal.domain === domains[right],
        );
        const leftAverage =
          leftSignals.reduce((sum, signal) => sum + signal.value, 0) /
          Math.max(1, leftSignals.length);
        const rightAverage =
          rightSignals.reduce((sum, signal) => sum + signal.value, 0) /
          Math.max(1, rightSignals.length);

        relationships.push({
          from: domains[left],
          to: domains[right],
          correlationStrength: Math.max(
            0,
            Math.round(100 - Math.abs(leftAverage - rightAverage)),
          ),
        });
      }
    }

    return {
      domains,
      relationships,
      fusionCoverage: Math.min(100, domains.length * 15),
    };
  }
}