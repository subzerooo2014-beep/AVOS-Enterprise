import { Injectable } from '@nestjs/common';
import {
  FOUNDATION_PRODUCTION_READINESS_CAPABILITIES,
  FoundationCertificate,
  ReadinessStatus,
} from './foundation-production-readiness.types';

@Injectable()
export class FoundationCompletionCertificateService {
  issue(input: {
    branch: string;
    score: number;
    status: ReadinessStatus;
    evidenceCount: number;
    blockers: string[];
  }): FoundationCertificate {
    return {
      certificateId: `avos-foundation-${Date.now()}`,
      system: 'AVOS Enterprise Foundation',
      branch: input.branch,
      status: input.status,
      score: Math.round(input.score),
      issuedAt: new Date().toISOString(),
      capabilities:
        FOUNDATION_PRODUCTION_READINESS_CAPABILITIES.length,
      evidenceCount: input.evidenceCount,
      blockers: input.blockers,
    };
  }
}