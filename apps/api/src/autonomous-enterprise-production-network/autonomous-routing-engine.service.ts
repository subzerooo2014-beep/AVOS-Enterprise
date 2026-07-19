import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AutonomousProductionNetworkStore } from './autonomous-production-network.store';
import {
  NetworkWorkload,
  RoutingDecision,
} from './autonomous-production-network.types';

@Injectable()
export class AutonomousRoutingEngineService {
  constructor(private readonly store: AutonomousProductionNetworkStore) {}

  submit(input: {
    objective: string;
    requiredCapabilities: string[];
    priority?: number;
    jurisdictions?: string[];
  }): NetworkWorkload {
    if (!input.objective || !input.requiredCapabilities?.length) {
      throw new BadRequestException(
        'Objective and requiredCapabilities are required.',
      );
    }

    const now = new Date().toISOString();
    const workload: NetworkWorkload = {
      id: `network-workload:${Date.now()}:${randomUUID().slice(0, 8)}`,
      objective: input.objective,
      requiredCapabilities: [...new Set(input.requiredCapabilities)],
      priority: input.priority ?? 50,
      jurisdictions: input.jurisdictions ?? ['GLOBAL'],
      status: 'submitted',
      assignedNodes: [],
      createdAt: now,
      updatedAt: now,
    };

    this.store.workloads.set(workload.id, workload);
    return workload;
  }

  route(
    workloadId: string,
    strategy: RoutingDecision['strategy'] = 'balanced',
  ): RoutingDecision {
    const workload = this.store.workloads.get(workloadId);
    if (!workload) {
      throw new BadRequestException(`Workload not found: ${workloadId}`);
    }

    const candidates = [...this.store.nodes.values()]
      .filter((node) => node.status !== 'offline')
      .map((node) => {
        const matchedCapabilities = workload.requiredCapabilities.filter(
          (capability) => node.capabilities.includes(capability),
        );
        const capabilityScore =
          matchedCapabilities.length / workload.requiredCapabilities.length;
        const loadRatio =
          node.capacity > 0 ? node.currentLoad / node.capacity : 1;
        const resilienceScore = node.healthScore / 100;

        const score =
          strategy === 'capability-first'
            ? capabilityScore * 0.7 +
              (1 - loadRatio) * 0.2 +
              resilienceScore * 0.1
            : strategy === 'resilience-first'
              ? capabilityScore * 0.35 +
                (1 - loadRatio) * 0.2 +
                resilienceScore * 0.45
              : capabilityScore * 0.5 +
                (1 - loadRatio) * 0.25 +
                resilienceScore * 0.25;

        return {
          node,
          matchedCapabilities,
          score: Number(score.toFixed(4)),
        };
      })
      .filter((candidate) => candidate.matchedCapabilities.length > 0)
      .sort((a, b) => b.score - a.score);

    if (!candidates.length) {
      throw new BadRequestException(
        'No network node can process this workload.',
      );
    }

    const selected = candidates.slice(0, Math.min(3, candidates.length));
    const decision: RoutingDecision = {
      id: `routing-decision:${Date.now()}:${randomUUID().slice(0, 8)}`,
      workloadId,
      selectedNodes: selected.map((candidate) => ({
        nodeId: candidate.node.id,
        factoryNamespace: candidate.node.factoryNamespace,
        score: candidate.score,
        reasons: [
          `Matched ${candidate.matchedCapabilities.length}/${workload.requiredCapabilities.length} capabilities`,
          `Node health score ${candidate.node.healthScore}`,
          `Available capacity ${Math.max(
            0,
            candidate.node.capacity - candidate.node.currentLoad,
          )}`,
        ],
      })),
      strategy,
      confidence: Number(Math.min(0.97, selected[0].score).toFixed(2)),
      requiresHumanApproval: workload.priority >= 90,
      createdAt: new Date().toISOString(),
    };

    workload.status = decision.requiresHumanApproval
      ? 'awaiting-human-approval'
      : 'routed';
    workload.assignedNodes = decision.selectedNodes.map((node) => node.nodeId);
    workload.routingDecisionId = decision.id;
    workload.updatedAt = new Date().toISOString();

    this.store.routingDecisions.set(decision.id, decision);
    return decision;
  }
}
