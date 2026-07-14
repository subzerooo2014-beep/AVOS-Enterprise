import { Injectable } from '@nestjs/common';
import {
  ArchitectureGenome,
  ArchitectureProposal,
  ArchitectureRiskLevel,
} from './architecture-governance.types';

@Injectable()
export class AdaptiveArchitectureKernelService {
  adapt(genome: ArchitectureGenome, objective: string): ArchitectureProposal {
    const fitnessValues = Object.values(genome.capabilityFitness);
    const currentFitness =
      fitnessValues.reduce((sum, value) => sum + value, 0) / fitnessValues.length;
    const riskLevel: ArchitectureRiskLevel =
      currentFitness < 55 ? 'high' : currentFitness < 75 ? 'medium' : 'low';

    return {
      id: `arc-${Date.now()}`,
      title: `Adaptive architecture response: ${objective}`,
      rationale:
        `The kernel evaluated architecture genome ${genome.version} at ` +
        `${Math.round(currentFitness)}% fitness and selected the lowest-fitness capabilities.`,
      targetCapabilities: Object.entries(genome.capabilityFitness)
        .sort(([, left], [, right]) => left - right)
        .slice(0, 3)
        .map(([capability]) => capability as ArchitectureProposal['targetCapabilities'][number]),
      expectedFitnessGain: Math.max(3, Math.min(20, Math.round((100 - currentFitness) * 0.25))),
      riskLevel,
      requiredPrinciples: ['security-by-design', 'auditability', 'backward-compatibility'],
      policyConflicts: [],
      status: 'proposed',
    };
  }
}