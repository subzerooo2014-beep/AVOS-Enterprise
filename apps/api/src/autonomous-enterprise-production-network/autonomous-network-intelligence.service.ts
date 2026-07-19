import { Injectable } from '@nestjs/common';
import { AutonomousProductionNetworkStore } from './autonomous-production-network.store';

@Injectable()
export class AutonomousNetworkIntelligenceService {
  constructor(private readonly store: AutonomousProductionNetworkStore) {}

  dashboard() {
    const nodes = [...this.store.nodes.values()];
    const workloads = [...this.store.workloads.values()];
    const onlineNodes = nodes.filter((node) => node.status === 'online').length;
    const averageHealth = nodes.length
      ? Math.round(
          nodes.reduce((total, node) => total + node.healthScore, 0) /
            nodes.length,
        )
      : 0;
    const utilization = nodes.length
      ? Number(
          (
            nodes.reduce(
              (total, node) =>
                total + node.currentLoad / Math.max(1, node.capacity),
              0,
            ) / nodes.length
          ).toFixed(4),
        )
      : 0;

    return {
      networkStatus:
        nodes.length > 0 && onlineNodes === nodes.length
          ? 'operational'
          : onlineNodes > 0
            ? 'degraded'
            : 'offline',
      totalNodes: nodes.length,
      onlineNodes,
      degradedNodes: nodes.filter((node) => node.status === 'degraded').length,
      offlineNodes: nodes.filter((node) => node.status === 'offline').length,
      averageHealth,
      averageUtilization: utilization,
      totalWorkloads: workloads.length,
      completedWorkloads: workloads.filter(
        (workload) => workload.status === 'completed',
      ).length,
      pendingHumanApprovals: workloads.filter(
        (workload) => workload.status === 'awaiting-human-approval',
      ).length,
      resilienceEvents: this.store.resilienceEvents.length,
      governanceDecisions: this.store.governanceDecisions.length,
      autonomousCoordination: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      generatedAt: new Date().toISOString(),
    };
  }
}
