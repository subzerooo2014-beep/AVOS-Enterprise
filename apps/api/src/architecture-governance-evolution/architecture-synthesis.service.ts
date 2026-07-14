import { Injectable } from '@nestjs/common';
import { ArchitectureProposal } from './architecture-governance.types';

@Injectable()
export class ArchitectureSynthesisService {
  synthesize(
    objective: string,
    targetCapabilities: ArchitectureProposal['targetCapabilities'],
    currentFitness: number,
    constraints: string[] = [],
  ): ArchitectureProposal {
    const normalizedFitness = Math.max(0, Math.min(100, currentFitness));
    const riskLevel =
      constraints.length >= 5 || normalizedFitness < 50
        ? 'high'
        : normalizedFitness < 75
          ? 'medium'
          : 'low';

    return {
      id: `syn-${Date.now()}`,
      title: `Synthesized architecture for ${objective}`,
      rationale:
        `Generated from ${targetCapabilities.length} target capabilities, ` +
        `${constraints.length} constraints, and ${normalizedFitness}% baseline fitness.`,
      targetCapabilities,
      expectedFitnessGain: Math.max(2, Math.min(25, Math.round((100 - normalizedFitness) / 4))),
      riskLevel,
      requiredPrinciples: ['modularity', 'observability', 'resilience', 'data-governance'],
      policyConflicts: constraints
        .filter((constraint) => constraint.toLowerCase().includes('conflict'))
        .map((constraint) => constraint),
      status: 'proposed',
    };
  }
}