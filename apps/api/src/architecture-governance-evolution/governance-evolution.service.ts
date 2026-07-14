import { Injectable } from '@nestjs/common';
import { ArchitectureProposal, GovernanceDecision } from './architecture-governance.types';
import { EnterprisePrincipleEngineService } from './enterprise-principle-engine.service';
import { PolicyNegotiationEngineService } from './policy-negotiation.service';
import { AutonomousConstitutionalEvolutionService } from './constitutional-evolution.service';

@Injectable()
export class GovernanceEvolutionService {
  constructor(
    private readonly principles: EnterprisePrincipleEngineService,
    private readonly policies: PolicyNegotiationEngineService,
    private readonly constitution: AutonomousConstitutionalEvolutionService,
  ) {}

  govern(proposal: ArchitectureProposal): {
    proposal: ArchitectureProposal;
    principleScore: number;
    decision: GovernanceDecision;
  } {
    const principleEvaluation = this.principles.evaluate(proposal);
    const withPrinciples: ArchitectureProposal = principleEvaluation.compliant
      ? proposal
      : {
          ...proposal,
          status: 'rejected',
          policyConflicts: [
            ...proposal.policyConflicts,
            ...principleEvaluation.violations.map(
              (violation) => `missing-principle:${violation}`,
            ),
          ],
        };

    const negotiated = this.policies.negotiate(withPrinciples);
    const decision = this.constitution.evolve(negotiated);

    return {
      proposal: negotiated,
      principleScore: principleEvaluation.score,
      decision,
    };
  }
}