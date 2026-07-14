import { Injectable } from '@nestjs/common';
import { ArchitectureProposal } from './architecture-governance.types';

@Injectable()
export class PolicyNegotiationEngineService {
  negotiate(proposal: ArchitectureProposal): ArchitectureProposal {
    const unresolvedConflicts = proposal.policyConflicts.filter(
      (conflict) => !conflict.toLowerCase().includes('waived'),
    );

    return {
      ...proposal,
      policyConflicts: unresolvedConflicts,
      status: unresolvedConflicts.length === 0 ? 'approved' : 'negotiating',
    };
  }
}