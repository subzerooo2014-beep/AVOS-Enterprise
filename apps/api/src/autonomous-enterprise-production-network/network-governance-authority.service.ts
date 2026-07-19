import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AutonomousProductionNetworkStore } from './autonomous-production-network.store';
import { NetworkGovernanceDecision } from './autonomous-production-network.types';

@Injectable()
export class NetworkGovernanceAuthorityService {
  constructor(private readonly store: AutonomousProductionNetworkStore) {}

  decide(input: {
    subjectType: NetworkGovernanceDecision['subjectType'];
    subjectId: string;
    decision: NetworkGovernanceDecision['decision'];
    approvedBy: string;
    reason: string;
  }): NetworkGovernanceDecision {
    if (!input.approvedBy.startsWith('human:')) {
      throw new BadRequestException('Human Final Authority is mandatory.');
    }

    const decision: NetworkGovernanceDecision = {
      id: `network-governance:${Date.now()}:${randomUUID().slice(0, 8)}`,
      ...input,
      globalComplianceReadinessGate: true,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString(),
    };

    if (input.subjectType === 'workload') {
      const workload = this.store.workloads.get(input.subjectId);
      if (!workload) {
        throw new BadRequestException(
          `Workload not found: ${input.subjectId}`,
        );
      }

      if (
        input.decision === 'approve' &&
        workload.status === 'awaiting-human-approval'
      ) {
        workload.status = 'routed';
        workload.updatedAt = new Date().toISOString();
      }

      if (input.decision === 'reject') {
        workload.status = 'failed';
        workload.updatedAt = new Date().toISOString();
      }
    }

    this.store.governanceDecisions.push(decision);
    return decision;
  }
}
