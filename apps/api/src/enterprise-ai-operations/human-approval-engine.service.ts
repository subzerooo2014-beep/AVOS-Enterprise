import { Injectable } from '@nestjs/common';

@Injectable()
export class HumanApprovalEngineService {
  evaluate(input: {
    requestId: string;
    requiredApprovals: number;
    approvals: Array<{
      approverId: string;
      approved: boolean;
    }>;
  }) {
    const approved = input.approvals.filter(
      (approval) => approval.approved,
    ).length;

    return {
      requestId: input.requestId,
      approved,
      requiredApprovals: input.requiredApprovals,
      complete: approved >= input.requiredApprovals,
    };
  }
}