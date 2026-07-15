import { Injectable } from '@nestjs/common';
import { ReleaseApproval } from './production-release.types';

@Injectable()
export class ReleaseGovernanceEngineService {
  evaluate(approvals: ReleaseApproval[]) {
    const required: ReleaseApproval['role'][] = [
      'qa',
      'security',
      'operations',
      'cto',
      'executive',
    ];

    const approved = required.filter((role) =>
      approvals.some(
        (approval) =>
          approval.role === role && approval.approved,
      ),
    );

    return {
      approvals,
      required,
      approved,
      score: Math.round(
        (approved.length / required.length) * 100,
      ),
      passed: approved.length === required.length,
    };
  }
}