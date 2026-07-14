import { Injectable } from '@nestjs/common';
import { ExternalSignal } from './global-ecosystem-intelligence.types';

@Injectable()
export class ExternalIntelligenceFusionEngineService {
  fuse(signals: ExternalSignal[]) {
    const grouped = new Map<string, ExternalSignal[]>();

    for (const signal of signals) {
      const existing = grouped.get(signal.domain) ?? [];
      existing.push(signal);
      grouped.set(signal.domain, existing);
    }

    const domains = [...grouped.entries()].map(([domain, domainSignals]) => {
      const confidenceWeight = domainSignals.reduce(
        (sum, signal) => sum + signal.confidence,
        0,
      );
      const fusedValue =
        domainSignals.reduce(
          (sum, signal) => sum + signal.value * signal.confidence,
          0,
        ) / Math.max(1, confidenceWeight);

      return {
        domain,
        fusedValue: Math.round(fusedValue),
        sourceCount: new Set(domainSignals.map((signal) => signal.source)).size,
        confidence: Number(
          (
            domainSignals.reduce(
              (sum, signal) => sum + signal.confidence,
              0,
            ) / Math.max(1, domainSignals.length)
          ).toFixed(3),
        ),
      };
    });

    return {
      domains,
      globalSignalStrength: Math.round(
        domains.reduce((sum, domain) => sum + domain.fusedValue, 0) /
          Math.max(1, domains.length),
      ),
    };
  }
}