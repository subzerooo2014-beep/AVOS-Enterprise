import { Injectable } from '@nestjs/common';
import { ArchitectureGenomeService } from './architecture-genome.service';
import { AdaptiveArchitectureKernelService } from './adaptive-architecture-kernel.service';
import { GovernanceEvolutionService } from './governance-evolution.service';
import { ContinuousArchitectureEvolutionService } from './architecture-evolution.service';
import { ArchitectureSignal } from './architecture-governance.types';

@Injectable()
export class SelfDesigningArchitectureService {
  constructor(
    private readonly genome: ArchitectureGenomeService,
    private readonly kernel: AdaptiveArchitectureKernelService,
    private readonly governance: GovernanceEvolutionService,
    private readonly evolution: ContinuousArchitectureEvolutionService,
  ) {}

  design(objective: string, signals: ArchitectureSignal[], constraints: string[] = []) {
    const genome = this.genome.generate(signals, constraints);
    const proposal = this.kernel.adapt(genome, objective);
    const governed = this.governance.govern(proposal);
    const evolution = this.evolution.register(governed.proposal, governed.decision);

    return {
      genome,
      proposal: governed.proposal,
      principleScore: governed.principleScore,
      decision: governed.decision,
      evolution,
    };
  }
}