import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AutonomousProductionNetworkStore } from './autonomous-production-network.store';
import { NetworkCoordinationPlan } from './autonomous-production-network.types';

@Injectable()
export class NetworkCoordinationOrchestratorService {
  constructor(private readonly store: AutonomousProductionNetworkStore) {}

  coordinate(workloadId: string): NetworkCoordinationPlan {
    const workload = this.store.workloads.get(workloadId);
    if (!workload) {
      throw new BadRequestException(`Workload not found: ${workloadId}`);
    }
    if (!workload.assignedNodes.length) {
      throw new BadRequestException(
        'Workload must be routed before coordination.',
      );
    }

    const stages = workload.assignedNodes.map((nodeId, index) => ({
      sequence: index + 1,
      nodeId,
      action:
        index === 0
          ? 'Primary production execution'
          : index === 1
            ? 'Parallel validation and enrichment'
            : 'Resilience standby and certification support',
      dependencies: index === 0 ? [] : [1],
    }));

    const plan: NetworkCoordinationPlan = {
      id: `network-coordination-plan:${Date.now()}:${randomUUID().slice(0, 8)}`,
      workloadId,
      stages,
      sharedContext: [
        'Living Blueprint context',
        'Enterprise Knowledge Fabric context',
        'Global Compliance jurisdiction context',
        'Decision traceability context',
      ],
      auditTrailEnabled: true,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString(),
    };

    workload.status = 'planned';
    workload.updatedAt = new Date().toISOString();
    this.store.coordinationPlans.set(plan.id, plan);
    return plan;
  }

  execute(workloadId: string) {
    const workload = this.store.workloads.get(workloadId);
    if (!workload) {
      throw new BadRequestException(`Workload not found: ${workloadId}`);
    }
    if (workload.status === 'awaiting-human-approval') {
      throw new BadRequestException(
        'Human approval is required before execution.',
      );
    }

    workload.status = 'executing';
    workload.updatedAt = new Date().toISOString();

    for (const nodeId of workload.assignedNodes) {
      const node = this.store.nodes.get(nodeId);
      if (node) {
        node.currentLoad += 1;
        node.updatedAt = new Date().toISOString();
      }
    }

    workload.status = 'completed';
    workload.updatedAt = new Date().toISOString();

    return {
      workloadId,
      status: workload.status,
      executedNodes: workload.assignedNodes,
      autonomousCoordinationComplete: true,
      humanFinalAuthorityPreserved: true,
      globalComplianceReadinessGate: true,
      completedAt: workload.updatedAt,
    };
  }
}
