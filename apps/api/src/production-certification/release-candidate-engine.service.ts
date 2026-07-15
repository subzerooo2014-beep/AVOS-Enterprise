import { Injectable } from '@nestjs/common';
import { ReleaseCandidate } from './production-certification.types';

@Injectable()
export class ReleaseCandidateEngineService {
  evaluate(
    input: Omit<ReleaseCandidate, 'status'>,
  ): ReleaseCandidate {
    const certified =
      input.buildPassed &&
      input.testsPassed &&
      input.securityPassed &&
      input.performancePassed &&
      input.compliancePassed;

    return {
      ...input,
      status: certified ? 'certified' : 'rejected',
    };
  }
}