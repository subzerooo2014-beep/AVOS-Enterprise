import { Injectable } from '@nestjs/common';
import { REQUIRED_EVIDENCE_DOMAINS } from '../domain/platform.constants';
import { ProductionEvidence } from '../domain/certification.types';

@Injectable()
export class EvidenceValidationService {
  validate(evidence: ProductionEvidence[]): {
    valid: boolean;
    score: number;
    verifiedDomains: number;
    totalDomains: number;
    reasons: string[];
  } {
    const reasons: string[] = [];
    const verified = new Set(
      evidence
        .filter((item) => item.state === 'verified' && !item.simulated)
        .map((item) => item.domain),
    );

    for (const requiredDomain of REQUIRED_EVIDENCE_DOMAINS) {
      if (!verified.has(requiredDomain)) {
        reasons.push('Missing verified real evidence domain: ' + requiredDomain);
      }
    }

    const simulated = evidence.filter((item) => item.simulated);
    if (simulated.length > 0) {
      reasons.push('Simulated evidence is not accepted.');
    }

    const verifiedDomains = verified.size;
    const totalDomains = REQUIRED_EVIDENCE_DOMAINS.length;
    const score = Math.round((verifiedDomains / totalDomains) * 100);

    return {
      valid: reasons.length === 0 && score === 100,
      score,
      verifiedDomains,
      totalDomains,
      reasons,
    };
  }
}
