import { Injectable } from '@nestjs/common';
import {
  ArchitectureProposal,
  GovernanceDecision,
} from './architecture-governance.types';

@Injectable()
export class AutonomousConstitutionalEvolutionService {
  evolve(
    proposal: ArchitectureProposal,
    currentVersion = '1.0.0',
  ): GovernanceDecision {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    const approved =
      proposal.status === 'approved' &&
      proposal.policyConflicts.length === 0 &&
      proposal.riskLevel !== 'critical';

    return {
      id: `gov-${Date.now()}`,
      proposalId: proposal.id,
      outcome: approved ? 'approved' : 'conditional',
      conditions: approved
        ? []
        : [
            'Resolve policy conflicts',
            'Obtain human approval for critical-risk evolution',
          ],
      constitutionalVersion: approved
        ? `${major}.${minor + 1}.0`
        : `${major}.${minor}.${patch}`,
      decidedAt: new Date().toISOString(),
    };
  }
}