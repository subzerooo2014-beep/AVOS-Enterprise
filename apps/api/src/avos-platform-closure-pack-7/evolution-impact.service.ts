import { Injectable } from '@nestjs/common';
import { EvolutionProposalInput } from './evolution-runtime.types';

@Injectable()
export class EvolutionImpactService {
  analyze(input: EvolutionProposalInput) {
    const impactScore = Math.min(
      100,
      input.affectedComponents.length * 15 +
        input.expectedBenefits.length * 10 +
        (input.strategic ? 25 : 0),
    );

    const riskScore = Math.min(
      100,
      input.risks.length * 20 +
        input.affectedComponents.length * 10 +
        (input.strategic ? 20 : 0),
    );

    return {
      impactScore,
      riskScore,
      requiresRecertification:
        input.strategic || impactScore >= 60 || riskScore >= 50,
    };
  }
}