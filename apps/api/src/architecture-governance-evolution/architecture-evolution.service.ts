import { Injectable } from '@nestjs/common';
import { ArchitectureProposal, GovernanceDecision } from './architecture-governance.types';

interface EvolutionRecord {
  sequence: number;
  proposal: ArchitectureProposal;
  decision: GovernanceDecision;
  appliedAt?: string;
}

@Injectable()
export class ContinuousArchitectureEvolutionService {
  private readonly records: EvolutionRecord[] = [];

  register(proposal: ArchitectureProposal, decision: GovernanceDecision): EvolutionRecord {
    const record: EvolutionRecord = {
      sequence: this.records.length + 1,
      proposal,
      decision,
      appliedAt: decision.outcome === 'approved' ? new Date().toISOString() : undefined,
    };
    this.records.push(record);
    return record;
  }

  history(): EvolutionRecord[] {
    return this.records.map((record) => ({ ...record }));
  }
}