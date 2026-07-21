import { Injectable } from '@nestjs/common';
import { HumanDecisionStatus } from './avos-software-development-os.types';

@Injectable()
export class HumanFinalAuthorityService {
  requiresApproval(strategicChange: boolean): boolean {
    return strategicChange === true;
  }

  initialDecision(strategicChange: boolean): HumanDecisionStatus {
    return this.requiresApproval(strategicChange) ? 'pending' : 'not-required';
  }

  assertApproved(status: HumanDecisionStatus): void {
    if (status === 'pending' || status === 'rejected') {
      throw new Error('Human Final Authority approval is required before execution.');
    }
  }
}