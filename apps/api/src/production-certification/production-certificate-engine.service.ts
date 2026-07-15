import { Injectable } from '@nestjs/common';
import {
  ProductionCertificate,
  ReleaseCandidate,
} from './production-certification.types';

@Injectable()
export class ProductionCertificateEngineService {
  issue(input: {
    releaseCandidate: ReleaseCandidate;
    score: number;
    approvals: string[];
    evidence: string[];
  }): ProductionCertificate {
    const status =
      input.releaseCandidate.status !== 'certified'
        ? 'rejected'
        : input.score >= 95
          ? 'certified'
          : input.score >= 80
            ? 'conditional'
            : 'rejected';

    return {
      id: `${input.releaseCandidate.id}-certificate`,
      releaseCandidateId: input.releaseCandidate.id,
      issuedAt: new Date().toISOString(),
      status,
      score: input.score,
      approvals: input.approvals,
      evidence: input.evidence,
    };
  }
}