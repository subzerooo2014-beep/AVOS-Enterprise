import { Injectable } from '@nestjs/common';
import {
  GovernanceDecision,
  DecisionOutcome,
} from './enterprise-strategic-governance.types';

@Injectable()
export class ExecutiveGovernanceCenterService {
  decide(
    subject: string,
    score: number,
    risks: string[],
  ): GovernanceDecision {
    const outcome: DecisionOutcome =
      risks.length > 3
        ? 'conditional'
        : score >= 75
          ? 'approved'
          : score >= 55
            ? 'conditional'
            : 'rejected';

    return {
      id: `decision-${Date.now()}`,
      subject,
      outcome,
      rationale: [
        `Strategic score evaluated at ${Math.round(score)}`,
        `Risk count evaluated at ${risks.length}`,
      ],
      conditions:
        outcome === 'conditional'
          ? ['Resolve priority risks', 'Revalidate execution readiness']
          : [],
      decidedAt: new Date().toISOString(),
    };
  }
}