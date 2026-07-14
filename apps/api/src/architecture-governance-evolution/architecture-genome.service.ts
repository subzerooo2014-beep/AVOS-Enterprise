import { Injectable } from '@nestjs/common';
import {
  ARCHITECTURE_CAPABILITIES,
  ArchitectureGenome,
  ArchitectureSignal,
} from './architecture-governance.types';

@Injectable()
export class ArchitectureGenomeService {
  generate(signals: ArchitectureSignal[], constraints: string[] = []): ArchitectureGenome {
    const weightedScore =
      signals.length === 0
        ? 70
        : signals.reduce((sum, signal) => sum + signal.value * signal.confidence, 0) /
          signals.reduce((sum, signal) => sum + signal.confidence, 0);

    const normalized = Math.max(0, Math.min(100, Math.round(weightedScore)));
    const dominantPatterns = [...new Set(signals.map((signal) => signal.category))]
      .filter(Boolean)
      .slice(0, 8);

    const capabilityFitness = Object.fromEntries(
      ARCHITECTURE_CAPABILITIES.map((capability, index) => [
        capability,
        Math.max(0, Math.min(100, normalized - (index % 3) * 2)),
      ]),
    ) as ArchitectureGenome['capabilityFitness'];

    return {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      dominantPatterns,
      capabilityFitness,
      constraints: [...new Set(constraints)],
    };
  }
}