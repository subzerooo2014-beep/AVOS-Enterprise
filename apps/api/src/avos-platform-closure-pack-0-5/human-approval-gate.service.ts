import { Injectable } from '@nestjs/common';
import {
  GovernanceDecision,
  HumanApprovalRecord,
} from './cognitive-governance.types';

@Injectable()
export class HumanApprovalGateService {
  approve(
    decision: GovernanceDecision,
    input: {
      approvedBy: string;
      action: 'approved' | 'rejected';
      reason?: string;
    },
  ): HumanApprovalRecord {
    if (!input.approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Human Approval Gate requires an approver identity prefixed with human:.');
    }

    return {
      approvedBy: input.approvedBy,
      action: input.action,
      reason: input.reason,
      approvedAt: new Date().toISOString(),
    };
  }
}