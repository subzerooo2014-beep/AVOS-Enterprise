import { Injectable } from '@nestjs/common';
import {
  ARCHITECTURE_CAPABILITIES,
  ArchitectureDashboardSnapshot,
  ArchitectureGenome,
  TechnicalDebtItem,
} from './architecture-governance.types';
import { ContinuousArchitectureEvolutionService } from './architecture-evolution.service';

@Injectable()
export class ArchitectureIntelligenceDashboardService {
  constructor(
    private readonly evolution: ContinuousArchitectureEvolutionService,
  ) {}

  snapshot(
    genome?: ArchitectureGenome,
    debtItems: TechnicalDebtItem[] = [],
  ): ArchitectureDashboardSnapshot {
    const history = this.evolution.history();
    const approved = history.filter(
      (record) => record.decision.outcome === 'approved',
    ).length;
    const fitness = genome
      ? Math.round(
          Object.values(genome.capabilityFitness).reduce(
            (sum, value) => sum + value,
            0,
          ) / ARCHITECTURE_CAPABILITIES.length,
        )
      : 70;
    const debtPenalty = debtItems.reduce((sum, item) => {
      const multiplier =
        item.severity === 'critical'
          ? 5
          : item.severity === 'high'
            ? 3
            : item.severity === 'medium'
              ? 2
              : 1;
      return sum + item.interestRate * multiplier;
    }, 0);

    return {
      generatedAt: new Date().toISOString(),
      architectureFitness: fitness,
      governanceMaturity: Math.min(100, 70 + approved * 3),
      technicalDebtScore: Math.max(0, Math.round(100 - debtPenalty)),
      activeProposals: history.filter(
        (record) => record.proposal.status === 'negotiating',
      ).length,
      approvedEvolutionActions: approved,
      capabilities: Object.fromEntries(
        ARCHITECTURE_CAPABILITIES.map((capability) => [
          capability,
          'operational',
        ]),
      ) as ArchitectureDashboardSnapshot['capabilities'],
    };
  }
}