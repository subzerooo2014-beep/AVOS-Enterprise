import { Injectable } from '@nestjs/common';
import { ArchitectureProposal } from './architecture-governance.types';

interface PrincipleEvaluation {
  compliant: boolean;
  score: number;
  violations: string[];
}

@Injectable()
export class EnterprisePrincipleEngineService {
  private readonly mandatoryPrinciples = [
    'security-by-design',
    'auditability',
    'backward-compatibility',
  ];

  evaluate(proposal: ArchitectureProposal): PrincipleEvaluation {
    const violations = this.mandatoryPrinciples.filter(
      (principle) => !proposal.requiredPrinciples.includes(principle),
    );
    const score = Math.round(
      ((this.mandatoryPrinciples.length - violations.length) /
        this.mandatoryPrinciples.length) *
        100,
    );

    return {
      compliant: violations.length === 0,
      score,
      violations,
    };
  }
}